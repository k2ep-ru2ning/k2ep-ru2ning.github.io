import { type ReactNode } from "react";
import { BsGithub } from "react-icons/bs";
import ExternalTooltipIconLink from "./external-tooltip-icon-link";

type LinkType = {
  link: string;
  icon: ReactNode;
  tooltipText: string;
};

export default function ExternalLinks() {
  const links: LinkType[] = [
    {
      link: "https://github.com/k2ep-ru2ning/k2ep-ru2ning.github.io",
      icon: <BsGithub className="size-6" />,
      tooltipText: "Github 저장소",
    },
  ];

  return (
    <div className="flex gap-2">
      {links.map(({ link, icon, tooltipText }, idx) => (
        <ExternalTooltipIconLink
          key={idx}
          href={link}
          icon={icon}
          tooltipText={tooltipText}
        />
      ))}
    </div>
  );
}
