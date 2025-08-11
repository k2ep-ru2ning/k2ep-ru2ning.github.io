import { cn } from "@/utils";

type Props = {
  tag: string;
  className?: string;
};

export default function Tag({ tag, className }: Props) {
  return (
    <div
      className={cn(
        "before:content-['#'] before:mr-0.5 m-0.5 px-2 py-1 rounded-md bg-zinc-200 dark:bg-zinc-700",
        className,
      )}
    >
      {tag}
    </div>
  );
}
