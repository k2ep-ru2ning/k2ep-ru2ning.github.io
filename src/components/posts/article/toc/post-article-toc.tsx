import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type PostContentHeading } from "@/schema/posts";
import { cn } from "@/utils/cn";
import { HeadingIcon } from "./heading-icon";

type Props = {
  headings: PostContentHeading[];
};

export function PostArticleTOC({ headings }: Props) {
  return (
    <nav className="flex flex-col gap-5 p-2 rounded-md border border-border">
      <h2 className="text-lg">목차</h2>
      <ul className="flex flex-col gap-2">
        {headings.map((item) => (
          <li key={item.id}>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "flex justify-start items-baseline gap-2 whitespace-normal h-fit p-1",
                item.type === "h3" && "pl-6",
              )}
            >
              <Link href={`#${item.id}`}>
                <HeadingIcon type={item.type} className="shrink-0" />
                {item.text}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
