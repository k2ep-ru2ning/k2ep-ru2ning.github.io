"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function ThemeSwitchButton() {
  const handleClick = () => {
    document.documentElement.classList.toggle("dark");
    const nextTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          onClick={handleClick}
          className="hover:bg-zinc-200 dark:hover:bg-zinc-700 size-8 flex justify-center items-center rounded-md"
        >
          <SunIcon className="dark:hidden size-6" />
          <MoonIcon className="hidden dark:block size-6" />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="bottom"
          sideOffset={8}
          className="text-sm bg-zinc-200 dark:bg-zinc-700 py-1 px-2 rounded-md"
        >
          테마 변경
          <Tooltip.Arrow className="fill-zinc-200 dark:fill-zinc-700" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
