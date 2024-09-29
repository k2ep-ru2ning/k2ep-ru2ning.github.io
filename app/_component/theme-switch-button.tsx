"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeSwitchButton() {
  const handleClick = () => {
    document.documentElement.classList.toggle("dark");
    const nextTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="hover:bg-zinc-200 dark:hover:bg-zinc-700 size-8 flex justify-center items-center rounded-md"
    >
      <SunIcon className="dark:hidden size-6" />
      <MoonIcon className="hidden dark:block size-6" />
    </button>
  );
}
