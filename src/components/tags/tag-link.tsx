import Link from "next/link";
import cn from "@/utils/cn";
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
            "bg-indigo-500 dark:bg-indigo-500 hover:bg-indigo-500 hover:dark:bg-indigo-500 text-zinc-50",
        )}
      />
    </Link>
  );
}
