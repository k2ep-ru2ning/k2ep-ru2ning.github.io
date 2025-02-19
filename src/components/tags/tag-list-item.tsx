import Link from "next/link";
import cn from "@/utils/cn";

type Props = {
  link: string;
  tag: string;
  className?: string;
};

export default function TagListItem({ link, tag, className }: Props) {
  return (
    <Link
      href={link}
      className={cn(
        "shrink-0 block px-2 py-1 rounded-md bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600",
        className,
      )}
    >
      {tag}
    </Link>
  );
}
