import { ExternalLink, Github } from "lucide-react";
import { type ReactNode } from "react";
import Tooltip from "../../tooltip";

type LinkType = {
  link: string;
  icon: ReactNode;
  tooltipText: string;
};

export default function ExternalLinks() {
  const links: LinkType[] = [
    {
      link: "https://github.com/k2ep-ru2ning/k2ep-ru2ning.github.io",
      icon: <Github className="size-6" />,
      tooltipText: "Github 저장소",
    },
  ];

  return (
    <div className="flex gap-2">
      {links.map(({ link, icon, tooltipText }, idx) => (
        <Tooltip
          key={idx}
          content={
            <div className="flex gap-1 items-center">
              {tooltipText}
              <ExternalLink className="size-4" />
            </div>
          }
          trigger={
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="size-8"
            >
              {icon}
            </a>
          }
        />
      ))}
    </div>
  );
}
