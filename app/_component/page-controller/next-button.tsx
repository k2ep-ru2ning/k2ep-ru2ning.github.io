"use client";

import { ChevronRightIcon } from "@heroicons/react/16/solid";
import PageNavButton from "./page-nav-button";
import { useRouter } from "next/navigation";

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
      <ChevronRightIcon className="size-4" />
    </PageNavButton>
  );
}
