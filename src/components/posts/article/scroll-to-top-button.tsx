"use client";

import { ArrowUpToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type Props = {
  className?: string;
};

export function ScrollToTopButton({ className }: Props) {
  const handleClickScrollToTopButton = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <Button
      type="button"
      onClick={handleClickScrollToTopButton}
      variant="outline"
      size="icon"
      className={cn(
        "lg:size-10 rounded-full bg-brand dark:bg-brand text-brand-foreground dark:text-brand-foreground border-0 hover:bg-brand hover:text-brand-foreground hover:dark:bg-brand hover:dark:text-brand-foreground",
        className,
      )}
    >
      <ArrowUpToLine className="size-5" />
    </Button>
  );
}
