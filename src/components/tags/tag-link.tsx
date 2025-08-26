import Link from "next/link";
import { paths } from "@/config/paths";
import { cn } from "@/utils/cn";
import { Button } from "../ui/button";

type Props = {
  tag: string;
  isActive?: boolean;
};

export function TagLink({ tag, isActive = false }: Props) {
  const href =
    tag === "전체" ? paths.posts.getHref() : paths.posts.getHref({ tag });

  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className={cn(
        "before:content-['#'] gap-0.5 px-2.5",
        isActive && "bg-brand dark:bg-brand hover:bg-brand hover:dark:bg-brand",
        isActive &&
          "text-brand-foreground dark:text-brand-foreground hover:text-brand-foreground hover:dark:text-brand-foreground",
        isActive && "border-brand dark:border-brand",
      )}
    >
      <Link href={href}>{tag}</Link>
    </Button>
  );
}
