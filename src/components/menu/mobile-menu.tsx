"use client";

import {
  AlignJustify,
  ExternalLink,
  File,
  FileStack,
  House,
  Moon,
  Sun,
  X,
  Github,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, VisuallyHidden } from "radix-ui";
import { useEffect, useState } from "react";
import useMediaQuery from "@/hooks/use-media-query";
import { cn, toggleTheme } from "@/utils";
import HorizontalSeparator from "../separator/horizontal-separator";
import { Button } from "../ui/button";

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
      <Dialog.Trigger asChild className="sm:hidden">
        <Button variant="ghost" size="icon">
          <AlignJustify className="size-6" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        {/* sticky header의 z-index가 10이어서 그 위에 정상적으로 표시되려면 z-index가 10어야 함 */}
        <Dialog.Content className="z-10 bg-background fixed inset-0 focus:outline-hidden flex flex-col">
          <header className="flex items-center justify-between p-3">
            <Dialog.Title className="px-2 py-1 font-extrabold text-xl shrink-0">
              메뉴
            </Dialog.Title>
            <VisuallyHidden.Root asChild>
              <Dialog.Description>
                메뉴 (내부 링크, 외부 링크, 테마 변경 등)
              </Dialog.Description>
            </VisuallyHidden.Root>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon">
                <X className="size-6" />
              </Button>
            </Dialog.Close>
          </header>
          <div className="px-4 py-6 flex flex-col gap-y-2 overflow-y-auto grow">
            <ul>
              {[
                {
                  link: "/",
                  icon: <House className="size-5" />,
                  label: "홈",
                  isActive: pathname === "/",
                },
                {
                  link: "/posts",
                  icon: <File className="size-5" />,
                  label: "글",
                  isActive: pathname === "/posts",
                },
                {
                  link: "/series",
                  icon: <FileStack className="size-5" />,
                  label: "시리즈",
                  isActive: pathname === "/series",
                },
              ].map(({ link, icon, label, isActive }) => (
                <li key={link}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex gap-2 justify-center items-center",
                      isActive && "text-indigo-500 hover:text-indigo-500",
                    )}
                    asChild
                  >
                    <Link href={link}>
                      {icon} {label}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
            <HorizontalSeparator />
            <ul>
              <li>
                <Button
                  asChild
                  variant="ghost"
                  className="flex gap-2 justify-center items-center"
                >
                  <a
                    href="https://github.com/k2ep-ru2ning/k2ep-ru2ning.github.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="size-5" />
                    Github 저장소
                    <ExternalLink className="size-5" />
                  </a>
                </Button>
              </li>
            </ul>
            <HorizontalSeparator />
            <Button
              type="button"
              onClick={toggleTheme}
              variant="ghost"
              className="flex gap-2 items-center justify-center"
            >
              <Sun className="dark:hidden size-5" />
              <Moon className="hidden dark:block size-5" />
              테마 변경
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
