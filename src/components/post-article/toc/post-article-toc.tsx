import Link from "next/link";
import { type PostContentHeading } from "@/schema/posts";
import { cn } from "@/utils";
import HeadingIcon from "./heading-icon";

type Props = {
  headings: PostContentHeading[];
};

export default function PostArticleTOC({ headings }: Props) {
  return (
    <section className="flex flex-col gap-5 p-2 rounded-md border border-zinc-300 dark:border-zinc-700">
      <h2 className="text-lg">목차</h2>
      <nav>
        <ul className="flex flex-col gap-2">
          {headings.map((item) => (
            <li key={item.id}>
              <Link
                href={`#${item.id}`}
                className={cn(
                  "flex items-baseline gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md p-0.5",
                  item.type === "h3" && "pl-6",
                )}
              >
                <HeadingIcon type={item.type} className="shrink-0" />
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
