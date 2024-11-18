"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsGithub } from "react-icons/bs";
import {
  LuAlignJustify,
  LuExternalLink,
  LuFileCode,
  LuHome,
  LuMoon,
  LuSun,
  LuTags,
  LuX,
} from "react-icons/lu";
import useMediaQuery from "@/hooks/use-media-query";
import cn from "@/utils/cn";
import { toggleTheme } from "@/utils/theme";
import HorizontalSeparator from "../separator/horizontal-separator";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="hover:bg-zinc-200 dark:hover:bg-zinc-700 size-8 flex sm:hidden justify-center items-center rounded-md">
          <LuAlignJustify className="size-6" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="bg-zinc-50 dark:bg-zinc-950 fixed inset-0 focus:outline-none flex flex-col">
          <header className="flex items-center justify-between p-4">
            <Dialog.Title className="p-2 font-extrabold text-xl shrink-0">
              k2ep-ru2ning
            </Dialog.Title>
            <VisuallyHidden.Root asChild>
              <Dialog.Description>
                메뉴 (내부 링크, 외부 링크, 테마 변경 등)
              </Dialog.Description>
            </VisuallyHidden.Root>
            <Dialog.Close asChild>
              <button className="hover:bg-zinc-200 dark:hover:bg-zinc-700 size-8 flex justify-center items-center rounded-md">
                <LuX className="size-6" />
              </button>
            </Dialog.Close>
          </header>
          <div className="px-4 py-6 flex flex-col gap-y-2 overflow-y-auto grow">
            <ul>
              {[
                {
                  link: "/",
                  icon: <LuHome className="size-5" />,
                  label: "홈",
                  isActive: pathname === "/",
                },
                {
                  link: "/posts/pages/1",
                  icon: <LuFileCode className="size-5" />,
                  label: "글 목록",
                  isActive: pathname.startsWith("/posts/pages"),
                },
                {
                  link: "/tags",
                  icon: <LuTags className="size-5" />,
                  label: "태그 목록",
                  isActive: pathname === "/tags",
                },
              ].map(({ link, icon, label, isActive }) => (
                <li key={link}>
                  <Link
                    href={link}
                    className={cn(
                      "flex gap-2 justify-end items-center p-2 hover:font-bold",
                      isActive && "text-indigo-500",
                    )}
                  >
                    {icon} {label}
                  </Link>
                </li>
              ))}
            </ul>
            <HorizontalSeparator />
            <ul>
              <li>
                <a
                  href="https://github.com/k2ep-ru2ning/k2ep-ru2ning.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2 items-center justify-end p-2 hover:font-bold"
                >
                  <BsGithub className="size-5" />
                  Github 저장소
                  <LuExternalLink className="size-5" />
                </a>
              </li>
            </ul>
            <HorizontalSeparator />
            <button
              type="button"
              onClick={toggleTheme}
              className="flex gap-2 items-center justify-end p-2 hover:font-bold"
            >
              <LuSun className="dark:hidden size-5" />
              <LuMoon className="hidden dark:block size-5" />
              테마 변경
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
