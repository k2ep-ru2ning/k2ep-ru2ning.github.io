import Link from "next/link";
import { type PostContentHeading } from "@/service/posts";
import cn from "@/utils/cn";

type Props = {
  item: PostContentHeading;
};

export default function PostArticleTOCItem({ item }: Props) {
  const depth = item.type === "h2" ? 2 : item.type === "h3" ? 3 : 4;

  return (
    <li
      key={item.id}
      className="hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md p-0.5"
    >
      <Link
        href={`#${item.id}`}
        className={cn("block", depth === 3 && "pl-3", depth === 4 && "pl-6")}
      >
        {item.text}
      </Link>
    </li>
  );
}
