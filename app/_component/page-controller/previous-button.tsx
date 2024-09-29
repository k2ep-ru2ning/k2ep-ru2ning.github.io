"use client";

import PageNavButton from "./page-nav-button";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";

type Props = {
  currentPageNumber: number;
  basePath: string;
};

export default function PreviousButton({ currentPageNumber, basePath }: Props) {
  const router = useRouter();

  const isDisabled = currentPageNumber === 1;

  const handleClick = () => {
    router.push(`${basePath}/${currentPageNumber - 1}`);
  };

  return (
    <PageNavButton
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label="move to previous page"
    >
      <ChevronLeftIcon className="size-4" />
    </PageNavButton>
  );
}
