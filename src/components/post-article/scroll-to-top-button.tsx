"use client";

import { LuArrowUpToLine } from "react-icons/lu";

export default function ScrollToTopButton() {
  const handleClickScrollToTopButton = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <button
      type="button"
      onClick={handleClickScrollToTopButton}
      className="rounded-md border border-zinc-300 dark:border-zinc-700 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700"
    >
      <LuArrowUpToLine className="size-5" />
    </button>
  );
}
