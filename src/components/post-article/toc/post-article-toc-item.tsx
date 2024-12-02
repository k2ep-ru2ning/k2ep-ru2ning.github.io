import Link from "next/link";
import { createElement } from "react";
import { LuChevronRight, LuCircle } from "react-icons/lu";
import cn from "@/utils/cn";

type Props = {
  link: string;
  text: string;
  depth: 2 | 3;
  isActive: boolean;
};

export default function PostArticleTOCItem({
  depth,
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
          depth === 3 && "pl-4",
          isActive && "text-indigo-500",
        )}
      >
        {createElement(isActive ? LuChevronRight : LuCircle, {
          className: "shrink-0 size-3",
        })}
        {text}
      </Link>
    </li>
  );
}
