"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  direction: "prev" | "next";
  currentPageNumber: number;
  numberOfPages: number;
};

export default function NavButton({
  direction,
  currentPageNumber,
  numberOfPages,
}: Props) {
  const router = useRouter();

  if (direction === "prev") {
    return (
      <button
        type="button"
        onClick={() => {
          router.push(`/pages/${currentPageNumber - 1}`);
        }}
        disabled={currentPageNumber === 1}
        className="w-7 h-7 flex justify-center items-center border border-gray-300 dark:border-gray-700 rounded-md disabled:text-gray-300 dark:disabled:text-gray-700"
      >
        <ChevronLeft size={16} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        router.push(`/pages/${currentPageNumber + 1}`);
      }}
      disabled={currentPageNumber === numberOfPages}
      className="w-7 h-7 flex justify-center items-center border border-gray-300 dark:border-gray-700 rounded-md disabled:text-gray-300 dark:disabled:text-gray-700"
    >
      <ChevronRight size={16} />
    </button>
  );
}
