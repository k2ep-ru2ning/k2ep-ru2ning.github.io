"use client";

import { Moon, Sun } from "lucide-react";
import { toggleTheme } from "@/utils";
import Tooltip from "../../tooltip";

export default function ThemeSwitchButton() {
  const handleClick = () => {
    toggleTheme();
  };

  return (
    <Tooltip
      trigger={
        <button type="button" onClick={handleClick} className="size-8">
          <Sun className="dark:hidden size-6" />
          <Moon className="hidden dark:block size-6" />
        </button>
      }
      content="테마 변경"
    />
  );
}
