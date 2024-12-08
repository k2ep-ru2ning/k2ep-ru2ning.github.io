import { type PostContentHeadingType } from "@/service/posts";
import cn from "@/utils/cn";

type Props = {
  type: PostContentHeadingType;
  className?: string;
};

export default function HeadingIcon({ type, className }: Props) {
  return (
    <div
      className={cn(
        "p-0.5 text-xs text-zinc-700 dark:text-zinc-300 rounded-md border border-zinc-300 dark:border-zinc-700",
        className,
      )}
    >
      {type === "h2" ? "H2" : "H3"}
    </div>
  );
}
