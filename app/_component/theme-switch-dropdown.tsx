"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/16/solid";

export default function ThemeSwitchDropdown() {
  const [isMounted, setIsMounted] = useState(false);

  const { theme, setTheme, themes, resolvedTheme } = useTheme();

  // 컴포넌트가 mount 되기전에,
  // theme 상태값을 사용하면 데이터 불일치 문제가 발생.

  // 서버에서는 theme 값을 제대로 알 수 없다.
  // => 즉, 서버가 전송한 html을 확인하면,
  // local storage에 있는 값이 아닌 디폴트값이
  // 선택되어 html이 생성된 것을 확인할 수 있다.
  // => 그래서 next-themes 공식문서에서,
  // 컴포넌트가 마운트 된 후,
  // 제대로 된 state 값을 사용해 UI를 Render 하라고 되어 있다.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="data-[state=open]:bg-zinc-200 dark:data-[state=open]:bg-zinc-700 outline-none hover:bg-zinc-200 dark:hover:bg-zinc-700 w-8 h-8 flex justify-center items-center rounded-md"
          aria-label="theme switch"
        >
          {resolvedTheme === "light" ? (
            <SunIcon className="size-6" />
          ) : (
            <MoonIcon className="size-6" />
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-28 p-1.5 border border-zinc-200 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-950"
          sideOffset={8}
          align="end"
        >
          <DropdownMenu.RadioGroup
            value={theme}
            onValueChange={(theme) => setTheme(theme)}
          >
            {themes.map((theme) => (
              <DropdownMenu.RadioItem
                key={theme}
                value={theme}
                className="flex justify-between items-center p-1 cursor-pointer rounded-md select-none outline-none hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                {theme}
                <DropdownMenu.ItemIndicator>
                  <CheckIcon className="text-indigo-500 size-4" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
