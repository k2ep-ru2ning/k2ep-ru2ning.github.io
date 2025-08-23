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
import { useEffect, useState } from "react";
import { paths } from "@/config/paths";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/utils/cn";
import { toggleTheme } from "@/utils/theme";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="sm:hidden">
        <Button variant="ghost" size="icon">
          <AlignJustify className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="duration-0 p-0 inset-0 translate-0 rounded-none max-w-full w-full h-dvh block"
      >
        <header className="flex items-center justify-between p-3 h-(--header-height)">
          <DialogTitle className="px-2 py-1 font-extrabold text-xl shrink-0">
            메뉴
          </DialogTitle>
          <DialogDescription className="sr-only">
            메뉴 (내부 링크, 외부 링크, 테마 변경 등)
          </DialogDescription>
          <DialogClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-6" />
            </Button>
          </DialogClose>
        </header>
        <ScrollArea className="h-[calc(100%-var(--header-height))] overflow-hidden px-4 pb-4">
          <div className="flex flex-col gap-2">
            <ul>
              {[
                {
                  link: paths.home.getHref(),
                  icon: <House className="size-5" />,
                  label: "홈",
                  isActive: pathname === paths.home.getHref(),
                },
                {
                  link: paths.posts.getHref(),
                  icon: <File className="size-5" />,
                  label: "글",
                  isActive: pathname === paths.posts.getHref(),
                },
                {
                  link: paths.series.getHref(),
                  icon: <FileStack className="size-5" />,
                  label: "시리즈",
                  isActive: pathname === paths.series.getHref(),
                },
              ].map(({ link, icon, label, isActive }) => (
                <li key={link}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex gap-2 justify-center items-center",
                      isActive && "text-brand hover:text-brand",
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
            <Separator />
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
            <Separator />
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
