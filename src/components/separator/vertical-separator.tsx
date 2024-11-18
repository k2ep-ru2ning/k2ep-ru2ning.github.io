import * as Separator from "@radix-ui/react-separator";

export default function VerticalSeparator() {
  return (
    <Separator.Root
      className="w-[1px] h-full bg-zinc-300 dark:bg-zinc-700"
      decorative
      orientation="vertical"
    />
  );
}
