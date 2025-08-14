import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";
import { Button } from "./ui/button";

type Props = {
  activePageNumber: number;
  numberOfPages: number;
  generatePageLink: (pageNumber: number) => string;
};

const PAGINATION_SIZE = 5;

export default function Pagination({
  activePageNumber,
  numberOfPages,
  generatePageLink,
}: Props) {
  const pageNumbers = getPageNumbers(activePageNumber, numberOfPages);

  const isActivePageNumberValid =
    activePageNumber >= 1 && activePageNumber <= numberOfPages;

  return (
    <nav>
      <ul className="p-4 flex items-center justify-center gap-2">
        <li>
          <Button asChild size="icon" variant="outline">
            <Link
              aria-label="Go to previous page"
              href={generatePageLink(activePageNumber - 1)}
              className={cn(
                (!isActivePageNumberValid || activePageNumber === 1) &&
                  "pointer-events-none text-muted-foreground",
              )}
            >
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
        </li>
        {pageNumbers.map((pageNumber) => (
          <li key={pageNumber}>
            <Button asChild size="icon" variant="outline">
              <Link
                href={generatePageLink(pageNumber)}
                className={cn(
                  pageNumber === activePageNumber &&
                    "font-bold text-brand hover:text-brand",
                )}
              >
                {pageNumber}
              </Link>
            </Button>
          </li>
        ))}
        <li>
          <Button asChild size="icon" variant="outline">
            <Link
              aria-label="Go to next page"
              href={generatePageLink(activePageNumber + 1)}
              className={cn(
                (!isActivePageNumberValid ||
                  activePageNumber === numberOfPages) &&
                  "pointer-events-none text-muted-foreground",
              )}
            >
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </li>
      </ul>
    </nav>
  );
}

/**
 * activePageNumber를 가운데 위치시키면서,
 * min(numberOfPages, PAGINATION_SIZE)개의 페이지 번호 배열을 계산하는 함수.
 */
function getPageNumbers(activePageNumber: number, numberOfPages: number) {
  if (activePageNumber < 1) {
    activePageNumber = 1;
  }
  if (activePageNumber > numberOfPages) {
    activePageNumber = numberOfPages;
  }

  // 화면에 표시할, 페이지 번호 버튼 개수.
  const size = Math.min(PAGINATION_SIZE, numberOfPages);

  const halfSize = Math.floor(size / 2);

  const pageNumbers = Array.from({ length: size }, (_, idx) => {
    const offset = idx - halfSize;
    return activePageNumber + offset;
  });

  // 1보다 작은 페이지 번호 개수 count.
  const smallerCount = pageNumbers.reduce(
    (prev, cur) => (cur < 1 ? prev + 1 : prev),
    0,
  );

  // 마지막 페이지 번호보다 큰 페이지 번호 개수 count.
  const biggerCount = pageNumbers.reduce(
    (prev, cur) => (cur > numberOfPages ? prev + 1 : prev),
    0,
  );

  // 1보다 작은 페이지 번호는 제거하고, 그 만큼 뒤에 페이지 번호 추가.
  for (let i = 0; i < smallerCount; i++) {
    const lastPageNumber = pageNumbers.at(-1);
    if (lastPageNumber) {
      pageNumbers.push(lastPageNumber + 1);
      pageNumbers.shift();
    }
  }

  // 마지막 페이지 번호보다 큰 페이지 번호는 제거하고, 그 만큼 앞에 페이지 번호 추가.
  for (let i = 0; i < biggerCount; i++) {
    const firstPageNumber = pageNumbers.at(0);
    if (firstPageNumber) {
      pageNumbers.unshift(firstPageNumber - 1);
      pageNumbers.pop();
    }
  }

  return pageNumbers;
}
