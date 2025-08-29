"use client";

import {
  House,
  File,
  FileStack,
  Github,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { repositoryHref } from "@/config/const";
import { paths } from "@/config/paths";
import { cn } from "@/utils/cn";
import { toggleTheme } from "@/utils/theme";

const MENU_ICON_SIZE_CLASS_NAME = "size-6";

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
    href: repositoryHref,
    icon: <Github className={MENU_ICON_SIZE_CLASS_NAME} />,
    label: "Github 저장소",
  },
] as const;

export function DesktopMenu() {
  const pathname = usePathname();

  return (
    <div className="hidden sm:flex gap-3 h-8">
      <TooltipProvider>
        {INTERNAL_LINKS.length > 0 && (
          <>
            <nav className="flex gap-2">
              {INTERNAL_LINKS.map(({ href, icon, label }) => (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className={cn(
                        pathname === href && "text-brand hover:text-brand",
                      )}
                    >
                      <Link href={href}>{icon}</Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
              ))}
            </nav>
            <Separator orientation="vertical" />
          </>
        )}
        {EXTERNAL_LINKS.length > 0 && (
          <>
            <div className="flex gap-2">
              {EXTERNAL_LINKS.map(({ href, icon, label }) => (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>
                    <Button asChild size="icon" variant="ghost">
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {icon}
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="flex gap-1 items-center">
                    {label}
                    <ExternalLink className="size-3" />
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            <Separator orientation="vertical" />
          </>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={toggleTheme}
              size="icon"
              variant="ghost"
            >
              <Sun className={cn("dark:hidden", MENU_ICON_SIZE_CLASS_NAME)} />
              <Moon
                className={cn("hidden dark:block", MENU_ICON_SIZE_CLASS_NAME)}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>테마 변경</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
