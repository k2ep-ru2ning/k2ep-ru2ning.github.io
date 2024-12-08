import Link from "next/link";
import { type PostContentHeadingType } from "@/service/posts";
import cn from "@/utils/cn";

type Props = {
  link: string;
  text: string;
  type: PostContentHeadingType;
  isActive: boolean;
};

export default function PostArticleTOCSidebarItem({
  type,
  link,
  text,
  isActive,
}: Props) {
  return (
    <li>
      <Link
        href={link}
        className={cn(
          "flex items-baseline gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md p-0.5",
          type === "h3" && "pl-6",
          isActive && "text-indigo-500",
        )}
      >
        <div
          className={cn(
            "p-0.5 shrink-0 text-xs text-zinc-700 dark:text-zinc-300 rounded-md border border-zinc-300 dark:border-zinc-700",
            isActive && "text-indigo-500 dark:text-indigo-500",
          )}
        >
          {type === "h2" ? "H2" : "H3"}
        </div>
        {text}
      </Link>
    </li>
  );
}
