const SETTINGS_KEY = "nightfallSettings";

const INITIAL_SETTINGS = {
  theme: "light",
  visitorName: "",
  lastVisit: null
};

function retrieveSettings() {
  try {
    const savedData = localStorage.getItem(SETTINGS_KEY);

    if (!savedData) {
      return { ...INITIAL_SETTINGS };
    }

    const preferences = JSON.parse(savedData);

    if (!preferences || typeof preferences !== "object") {
      return { ...INITIAL_SETTINGS };
    }

    return {
      theme: preferences.theme === "dark" ? "dark" : "light",

      visitorName:
        typeof preferences.visitorName === "string"
          ? preferences.visitorName
          : "",

      lastVisit:
        typeof preferences.lastVisit === "string"
          ? preferences.lastVisit
          : null
    };
  } catch (error) {
    console.warn(
      "The saved settings were damaged. Default settings are being used."
    );

    return { ...INITIAL_SETTINGS };
  }
}

function storeSettings(settings) {
  try {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );

    return true;
  } catch (error) {
    console.warn(
      "The settings could not be saved in Local Storage."
    );

    return false;
  }
}

function createVisitMessage(lastVisit) {
  if (!lastVisit) {
    return "FIRST VISIT DETECTED // WELCOME, INITIATE.";
  }

  const visitDate = new Date(lastVisit);

  if (Number.isNaN(visitDate.getTime())) {
    return "WELCOME BACK, INITIATE.";
  }

  return `LAST CONNECTION: ${visitDate.toLocaleString()}`;
}

function updateInterface(settings) {
  const themeButton = document.querySelector("#theme-toggle");
  const welcomeText = document.querySelector("#welcome-message");
  const latestVisit = document.querySelector("#last-visit");
  const nameField = document.querySelector("#visitor-name");

  document.documentElement.dataset.theme = settings.theme;

  themeButton.textContent =
    settings.theme === "dark"
      ? "LIGHT MODE"
      : "DARK MODE";

  themeButton.setAttribute(
    "aria-label",
    `Change to ${
      settings.theme === "dark" ? "light" : "dark"
    } mode`
  );

  welcomeText.textContent = settings.visitorName
    ? `WELCOME BACK, ${settings.visitorName.toUpperCase()} //`
    : "WELCOME, INITIATE // IDENTIFICATION REQUIRED.";

  latestVisit.textContent = createVisitMessage(settings.lastVisit);

  nameField.value = settings.visitorName;
}

function activatePersistence() {
  let currentSettings = retrieveSettings();

  updateInterface(currentSettings);

  const themeButton = document.querySelector("#theme-toggle");
  const visitorForm = document.querySelector("#visitor-form");
  const nameField = document.querySelector("#visitor-name");
  const formMessage = document.querySelector("#form-message");

  themeButton.addEventListener("click", () => {
    currentSettings = {
      ...currentSettings,
      theme:
        currentSettings.theme === "dark"
          ? "light"
          : "dark"
    };

    updateInterface(currentSettings);
    storeSettings(currentSettings);
  });

  visitorForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const enteredName = nameField.value.trim();

    if (!enteredName) {
      formMessage.textContent =
        "ERROR // AGENT NAME IS REQUIRED.";

      return;
    }

    currentSettings = {
      ...currentSettings,
      visitorName: enteredName,
      lastVisit: new Date().toISOString()
    };

    const wasSaved = storeSettings(currentSettings);

    updateInterface(currentSettings);

    formMessage.textContent = wasSaved
      ? "ACCESS GRANTED // PROFILE SAVED."
      : "SYSTEM ERROR // PROFILE COULD NOT BE SAVED.";
  });
}

document.addEventListener(
  "DOMContentLoaded",
  activatePersistence
);