"use client";

import { ArrowUpToLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollToTopButton() {
  const handleClickScrollToTopButton = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <Button
      type="button"
      onClick={handleClickScrollToTopButton}
      variant="outline"
      size="icon"
    >
      <ArrowUpToLine className="size-5" />
    </Button>
  );
}
