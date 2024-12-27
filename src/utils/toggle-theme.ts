export default function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  const nextTheme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
  localStorage.setItem("theme", nextTheme);
}
