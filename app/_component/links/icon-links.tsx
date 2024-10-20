import IconLink from "./icon-link";
import { ReactNode } from "react";
import { BsGithub } from "react-icons/bs";
import { LuFileCode, LuHome, LuTags } from "react-icons/lu";

type IconLinkType = {
  link: string;
  icon: ReactNode;
  tooltipText: string;
};

export default function IconLinks() {
  const links: IconLinkType[] = [
    {
      link: "/",
      icon: <LuHome className="size-6" />,
      tooltipText: "홈",
    },
    {
      link: "/posts/pages/1",
      icon: <LuFileCode className="size-6" />,
      tooltipText: "글 목록",
    },
    {
      link: "/tags",
      icon: <LuTags className="size-6" />,
      tooltipText: "태그 목록",
    },
    {
      link: "https://github.com/k2ep-ru2ning/k2ep-ru2ning.github.io",
      icon: <BsGithub className="size-6" />,
      tooltipText: "Github 저장소",
    },
  ];

  return (
    <nav className="flex gap-3">
      {links.map(({ link, icon, tooltipText }, idx) => (
        <IconLink key={idx} href={link} icon={icon} tooltipText={tooltipText} />
      ))}
    </nav>
  );
}
