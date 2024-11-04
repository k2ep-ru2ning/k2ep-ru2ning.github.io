import * as Separator from "@radix-ui/react-separator";

export default function HorizontalSeparator() {
  return (
    <Separator.Root
      className="w-full h-[1px] bg-zinc-300 dark:bg-zinc-700"
      decorative
      orientation="horizontal"
    />
  );
}
