"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toggleTheme } from "@/utils";

export default function ThemeSwitchButton() {
  const handleClick = () => {
    toggleTheme();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" onClick={handleClick} size="icon" variant="ghost">
          <Sun className="dark:hidden size-6" />
          <Moon className="hidden dark:block size-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>테마 변경</TooltipContent>
    </Tooltip>
  );
}
