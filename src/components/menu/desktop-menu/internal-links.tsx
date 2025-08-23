"use client";

import { House, File, FileStack } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { paths } from "@/config/paths";
import { cn } from "@/utils/cn";

type LinkType = {
  link: string;
  icon: ReactNode;
  tooltipText: string;
  isActive: boolean;
};

export default function InternalLinks() {
  const pathname = usePathname();

  const links: LinkType[] = [
    {
      link: paths.home.getHref(),
      icon: <House className="size-6" />,
      tooltipText: "홈",
      isActive: pathname === paths.home.getHref(),
    },
    {
      link: paths.posts.getHref(),
      icon: <File className="size-6" />,
      tooltipText: "글",
      isActive: pathname === paths.posts.getHref(),
    },
    {
      link: paths.series.getHref(),
      icon: <FileStack className="size-6" />,
      tooltipText: "시리즈",
      isActive: pathname === paths.series.getHref(),
    },
  ];

  return (
    <nav className="flex gap-2">
      {links.map(({ link, icon, tooltipText, isActive }, idx) => (
        <Tooltip key={idx}>
          <TooltipTrigger asChild>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className={cn(isActive && "text-brand hover:text-brand")}
            >
              <Link href={link}>{icon}</Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tooltipText}</TooltipContent>
        </Tooltip>
      ))}
    </nav>
  );
}
