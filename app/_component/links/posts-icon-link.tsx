"use client";

import { NotebookText } from "lucide-react";
import IconLink from "./icon-link";
import { usePathname } from "next/navigation";

const POSTS_LINK = "/posts/pages/1";

export default function PostsIconLink() {
  const pathname = usePathname();

  const isActive = pathname === POSTS_LINK;

  return (
    <IconLink href={POSTS_LINK} isActive={isActive}>
      <NotebookText size={24} />
    </IconLink>
  );
}
