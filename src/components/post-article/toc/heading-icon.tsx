import { type PostContentHeadingType } from "@/schema/posts";
import { cn } from "@/utils/cn";

type Props = {
  type: PostContentHeadingType;
  className?: string;
};

export default function HeadingIcon({ type, className }: Props) {
  return (
    <div
      className={cn("p-0.5 text-xs rounded-md border border-border", className)}
    >
      {type === "h2" ? "H2" : "H3"}
    </div>
  );
}
