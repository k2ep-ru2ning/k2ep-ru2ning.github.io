type Theme = "light" | "dark";

export function themeClassInitializationScript() {
  const themeFromLocalStorage = localStorage.getItem("theme");
  if (themeFromLocalStorage === "light" || themeFromLocalStorage === "dark") {
    _setThemeClass(themeFromLocalStorage);
    return;
  }

  const themeFromSystem = window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
  _setThemeClass(themeFromSystem);

  function _setThemeClass(newTheme: Theme) {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}

export function setThemeClass(theme: Theme) {
  switch (theme) {
    case "dark": {
      document.documentElement.classList.add("dark");
      break;
    }
    case "light": {
      document.documentElement.classList.remove("dark");
      break;
    }
    default: {
      const _exhaustivenessCheck: never = theme;
      throw new Error(`유효하지 않은 테마: ${_exhaustivenessCheck}`);
    }
  }
}

export function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  const nextTheme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
  localStorage.setItem("theme", nextTheme);
}
