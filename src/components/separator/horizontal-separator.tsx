import { Separator } from "radix-ui";

export default function HorizontalSeparator() {
  return (
    <Separator.Root
      className="w-full h-[1px] bg-zinc-300 dark:bg-zinc-700 shrink-0"
      decorative
      orientation="horizontal"
    />
  );
}
