"use client";

import { usePathname } from "next/navigation";
import IconLink from "./icon-link";
import { ReactNode } from "react";
import { BsGithub } from "react-icons/bs";
import { LuFileCode, LuHome, LuTags } from "react-icons/lu";

type IconLinkType = {
  link: string;
  icon: ReactNode;
  tooltipText: string;
  isActive: boolean;
};

export default function IconLinks() {
  const pathname = usePathname();

  const links: IconLinkType[] = [
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
    {
      link: "https://github.com/k2ep-ru2ning/k2ep-ru2ning.github.io",
      icon: <BsGithub className="size-6" />,
      tooltipText: "Github 저장소",
      isActive: false,
    },
  ];

  return (
    <nav className="flex gap-3">
      {links.map(({ link, icon, tooltipText, isActive }, idx) => (
        <IconLink
          key={idx}
          href={link}
          icon={icon}
          tooltipText={tooltipText}
          isActive={isActive}
        />
      ))}
    </nav>
  );
}
