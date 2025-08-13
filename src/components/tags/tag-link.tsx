import Link from "next/link";
import { cn } from "@/utils";
import Tag from "./tag";

type Props = {
  tag: string;
  isActive?: boolean;
};

export default function TagLink({ tag, isActive = false }: Props) {
  let link = "/posts";

  if (tag !== "전체") {
    link += `?tag=${encodeURIComponent(tag)}`;
  }

  return (
    <Link href={link}>
      <Tag
        tag={tag}
        className={cn(
          "hover:bg-zinc-300 dark:hover:bg-zinc-600",
          isActive &&
            "bg-brand dark:bg-brand hover:bg-brand hover:dark:bg-brand text-brand-foreground",
        )}
      />
    </Link>
  );
}
