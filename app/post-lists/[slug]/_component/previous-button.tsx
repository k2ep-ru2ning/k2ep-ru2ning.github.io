"use client";

import { ChevronLeft } from "lucide-react";
import PageNavButton from "./page-nav-button";
import { useRouter } from "next/navigation";

type Props = {
  currentPageNumber: number;
};

export default function PreviousButton({ currentPageNumber }: Props) {
  const router = useRouter();

  const isDisabled = currentPageNumber === 1;

  const handleClick = () => {
    router.push(`/post-lists/${currentPageNumber - 1}`);
  };

  return (
    <PageNavButton
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label="move to previous page"
    >
      <ChevronLeft size={16} />
    </PageNavButton>
  );
}
