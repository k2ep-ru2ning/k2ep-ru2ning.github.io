"use client";

import { LuMoon, LuSun } from "react-icons/lu";
import { toggleTheme } from "@/utils/theme";
import Tooltip from "../../tooltip";

export default function ThemeSwitchButton() {
  const handleClick = () => {
    toggleTheme();
  };

  return (
    <Tooltip
      trigger={
        <button type="button" onClick={handleClick} className="size-8">
          <LuSun className="dark:hidden size-6" />
          <LuMoon className="hidden dark:block size-6" />
        </button>
      }
      text="테마 변경"
    />
  );
}
