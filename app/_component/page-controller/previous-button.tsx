"use client";

import { LuChevronLeft } from "react-icons/lu";
import PageNavButton from "./page-nav-button";
import { useRouter } from "next/navigation";

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
      <LuChevronLeft className="size-4" />
    </PageNavButton>
  );
}
