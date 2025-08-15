import { cn } from "@/utils";

type Props = {
  tag: string;
  className?: string;
};

export default function Tag({ tag, className }: Props) {
  return (
    <div
      className={cn(
        "text-sm text-secondary-foreground before:content-['#'] before:mr-[1px]",
        className,
      )}
    >
      {tag}
    </div>
  );
}
