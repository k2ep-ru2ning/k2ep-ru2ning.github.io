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

const MENU_ICON_SIZE_CLASS_NAME = "size-4";

const INTERNAL_LINKS = [
  {
    href: paths.home.getHref(),
    icon: <House className={MENU_ICON_SIZE_CLASS_NAME} />,
    label: "홈",
  },
  {
    href: paths.posts.getHref(),
    icon: <File className={MENU_ICON_SIZE_CLASS_NAME} />,
    label: "글",
  },
  {
    href: paths.series.getHref(),
    icon: <FileStack className={MENU_ICON_SIZE_CLASS_NAME} />,
    label: "시리즈",
  },
] as const;

const EXTERNAL_LINKS = [
  {
    href: "https://github.com/k2ep-ru2ning/k2ep-ru2ning.github.io",
    icon: <Github className={MENU_ICON_SIZE_CLASS_NAME} />,
    label: "Github 저장소",
  },
] as const;

export function MobileMenuDialog() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    // pathname이 바뀌면, 즉 페이지가 이동하면 다이얼로그 닫기
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    // 너비가 늘어나서 모바일 크기가 아니라면, 다이얼로그 닫기
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
        <ScrollArea className="h-[calc(100%-var(--header-height))] px-4 pb-4">
          <div className="flex flex-col gap-2">
            {INTERNAL_LINKS.length > 0 && (
              <>
                <nav>
                  <ul>
                    {INTERNAL_LINKS.map(({ href, icon, label }) => (
                      <li key={href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "flex gap-2 justify-center items-center",
                            href === pathname && "text-brand hover:text-brand",
                          )}
                          asChild
                        >
                          <Link href={href}>
                            {icon} {label}
                          </Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </nav>
                <Separator />
              </>
            )}
            {EXTERNAL_LINKS.length > 0 && (
              <>
                <ul>
                  {EXTERNAL_LINKS.map(({ href, icon, label }) => (
                    <li key={href}>
                      <Button
                        asChild
                        variant="ghost"
                        className="flex gap-2 justify-center items-center"
                      >
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {icon}
                          {label}
                          <ExternalLink className={MENU_ICON_SIZE_CLASS_NAME} />
                        </a>
                      </Button>
                    </li>
                  ))}
                </ul>
                <Separator />
              </>
            )}
            <Button
              type="button"
              onClick={toggleTheme}
              variant="ghost"
              className="flex gap-2 items-center justify-center"
            >
              <Sun className={cn("dark:hidden", MENU_ICON_SIZE_CLASS_NAME)} />
              <Moon
                className={cn("hidden dark:block", MENU_ICON_SIZE_CLASS_NAME)}
              />
              테마 변경
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
