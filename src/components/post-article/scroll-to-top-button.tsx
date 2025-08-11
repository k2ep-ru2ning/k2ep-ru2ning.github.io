"use client";

import { ArrowUpToLine } from "lucide-react";
import { cn } from "@/utils";

type Props = {
  size: "large" | "base";
};

export default function ScrollToTopButton({ size }: Props) {
  const handleClickScrollToTopButton = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <button
      type="button"
      onClick={handleClickScrollToTopButton}
      className="bg-background rounded-md border border-zinc-300 dark:border-zinc-700 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700"
    >
      <ArrowUpToLine className={cn("size-5", size === "large" && "size-7")} />
    </button>
  );
}
