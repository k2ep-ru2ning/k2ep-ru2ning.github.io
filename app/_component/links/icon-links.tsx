import { NotebookText, Tag } from "lucide-react";
import IconLink from "./icon-link";

export default function IconLinks() {
  const links = [
    {
      link: "/posts/pages/1",
      icon: <NotebookText size={24} />,
      tooltipText: "글 목록",
    },
    {
      link: "/tags",
      icon: <Tag size={24} />,
      tooltipText: "태그 목록",
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
