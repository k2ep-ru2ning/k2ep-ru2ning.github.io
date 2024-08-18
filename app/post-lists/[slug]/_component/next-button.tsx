"use client";

import { ChevronRight } from "lucide-react";
import PageNavButton from "./page-nav-button";
import { useRouter } from "next/navigation";

type Props = {
  currentPageNumber: number;
  numberOfPages: number;
};

export default function NextButton({
  currentPageNumber,
  numberOfPages,
}: Props) {
  const router = useRouter();

  const isDisabled = currentPageNumber === numberOfPages;

  const handleClick = () => {
    router.push(`/post-lists/${currentPageNumber + 1}`);
  };

  return (
    <PageNavButton
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label="move to next page"
    >
      <ChevronRight size={16} />
    </PageNavButton>
  );
}
