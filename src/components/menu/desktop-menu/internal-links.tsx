"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { LuFileCode, LuHome, LuTags } from "react-icons/lu";
import cn from "@/utils/cn";
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
      icon: <LuHome className="size-6" />,
      tooltipText: "홈",
      isActive: pathname === "/",
    },
    {
      link: "/posts/pages/1",
      icon: <LuFileCode className="size-6" />,
      tooltipText: "글 목록",
      isActive: pathname.startsWith("/posts/pages"),
    },
    {
      link: "/tags",
      icon: <LuTags className="size-6" />,
      tooltipText: "태그 목록",
      isActive: pathname === "/tags",
    },
  ];

  return (
    <nav className="flex gap-2">
      {links.map(({ link, icon, tooltipText, isActive }, idx) => (
        <Tooltip
          key={idx}
          text={tooltipText}
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
