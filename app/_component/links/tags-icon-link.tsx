"use client";

import { Tag } from "lucide-react";
import IconLink from "./icon-link";
import { usePathname } from "next/navigation";

const TAGS_LINK = "/tags";

export default function TagsIconLink() {
  const pathname = usePathname();

  const isActive = pathname === TAGS_LINK;

  return (
    <IconLink href={TAGS_LINK} isActive={isActive}>
      <Tag size={24} />
    </IconLink>
  );
}
