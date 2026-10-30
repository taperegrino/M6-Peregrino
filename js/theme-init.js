/*
  This script runs immediately in the head section.
  Its purpose is to apply the saved theme before the page is painted.
*/

(function applySavedTheme() {
  const storageKey = "nightfallSettings";
  const defaultTheme = "light";

  let activeTheme = defaultTheme;

  try {
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
      const preferences = JSON.parse(savedData);

      if (
        preferences &&
        (preferences.theme === "light" ||
          preferences.theme === "dark")
      ) {
        activeTheme = preferences.theme;
      }
    }
  } catch (error) {
    activeTheme = defaultTheme;
  }

  document.documentElement.dataset.theme = activeTheme;
})();