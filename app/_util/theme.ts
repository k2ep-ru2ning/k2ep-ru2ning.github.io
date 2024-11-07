export function initializeThemeFromLocal() {
  const themeFromLocalStorage = localStorage.getItem("theme");

  const themeFromSystem = window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";

  const theme = themeFromLocalStorage || themeFromSystem;

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  const nextTheme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
  localStorage.setItem("theme", nextTheme);
}
