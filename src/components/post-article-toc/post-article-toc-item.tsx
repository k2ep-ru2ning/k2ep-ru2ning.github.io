import Link from "next/link";
import cn from "@/utils/cn";
import { type Heading } from "@/utils/mdx";

type Props = {
  item: Heading;
};

export default function PostArticleTOCItem({ item }: Props) {
  const depth = item.type === "h2" ? 2 : item.type === "h3" ? 3 : 4;

  return (
    <li key={item.id}>
      <Link
        href={`#${item.id}`}
        className={cn("block", depth === 3 && "pl-3", depth === 4 && "pl-6")}
      >
        {item.text}
      </Link>
    </li>
  );
}
