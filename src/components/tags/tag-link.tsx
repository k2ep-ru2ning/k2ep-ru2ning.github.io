import Link from "next/link";
import cn from "@/utils/cn";
import Tag from "./tag";

type Props = {
  link: string;
  tag: string;
  className?: string;
};

export default function TagLink({ link, tag, className }: Props) {
  return (
    <Link href={link}>
      <Tag
        tag={tag}
        className={cn("hover:bg-zinc-300 dark:hover:bg-zinc-600", className)}
      />
    </Link>
  );
}
