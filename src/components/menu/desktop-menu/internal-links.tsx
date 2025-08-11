"use client";

import { House, File, FileStack } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/utils";
import Tooltip from "../../tooltip";

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
      link: "/",
      icon: <House className="size-6" />,
      tooltipText: "홈",
      isActive: pathname === "/",
    },
    {
      link: "/posts",
      icon: <File className="size-6" />,
      tooltipText: "글",
      isActive: pathname === "/posts",
    },
    {
      link: "/series",
      icon: <FileStack className="size-6" />,
      tooltipText: "시리즈",
      isActive: pathname === "/series",
    },
  ];

  return (
    <nav className="flex gap-2">
      {links.map(({ link, icon, tooltipText, isActive }, idx) => (
        <Tooltip
          key={idx}
          content={tooltipText}
          trigger={
            <Link
              href={link}
              className={cn("size-8", isActive && "text-indigo-500")}
            >
              {icon}
            </Link>
          }
        />
      ))}
    </nav>
  );
}
