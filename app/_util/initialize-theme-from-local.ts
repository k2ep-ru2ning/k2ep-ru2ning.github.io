export default function initializeThemeFromLocal() {
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
