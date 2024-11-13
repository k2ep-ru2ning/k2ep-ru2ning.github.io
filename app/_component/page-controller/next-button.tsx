"use client";

import { useRouter } from "next/navigation";
import { LuChevronRight } from "react-icons/lu";
import PageNavButton from "./page-nav-button";

type Props = {
  currentPageNumber: number;
  numberOfPages: number;
  basePath: string;
};

export default function NextButton({
  currentPageNumber,
  numberOfPages,
  basePath,
}: Props) {
  const router = useRouter();

  const isDisabled = currentPageNumber === numberOfPages;

  const handleClick = () => {
    router.push(`${basePath}/${currentPageNumber + 1}`);
  };

  return (
    <PageNavButton
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label="move to next page"
    >
      <LuChevronRight className="size-4" />
    </PageNavButton>
  );
}
