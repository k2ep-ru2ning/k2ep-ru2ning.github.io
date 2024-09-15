import { NotebookText, Tag } from "lucide-react";
import IconLink from "./icon-link";

export default function IconLinks() {
  const links = [
    {
      link: "/posts/pages/1",
      icon: <NotebookText size={24} />,
    },
    {
      link: "/tags",
      icon: <Tag size={24} />,
    },
  ];

  return (
    <nav className="flex gap-3">
      {links.map(({ link, icon }, idx) => (
        <IconLink key={idx} href={link}>
          {icon}
        </IconLink>
      ))}
    </nav>
  );
}
