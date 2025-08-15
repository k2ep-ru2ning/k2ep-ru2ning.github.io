import { cn } from "@/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

type Props = {
  activePageNumber: number;
  numberOfPages: number;
  generatePageLink: (pageNumber: number) => string;
};

// 표시할 최대 pagination item 개수.
const PAGINATION_SIZE = 5;

export default function PostsPagination({
  activePageNumber,
  numberOfPages,
  generatePageLink,
}: Props) {
  const pageNumbers = getPageNumbers(activePageNumber, numberOfPages);

  const isActivePageNumberValid =
    activePageNumber >= 1 && activePageNumber <= numberOfPages;

  return (
    <Pagination>
      <PaginationContent className="flex-wrap">
        <PaginationItem>
          <PaginationPrevious
            href={generatePageLink(activePageNumber - 1)}
            className={cn(
              (!isActivePageNumberValid || activePageNumber === 1) &&
                "pointer-events-none text-muted-foreground",
            )}
          />
        </PaginationItem>
        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href={generatePageLink(pageNumber)}
              isActive={pageNumber === activePageNumber}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={generatePageLink(activePageNumber + 1)}
            className={cn(
              (!isActivePageNumberValid ||
                activePageNumber === numberOfPages) &&
                "pointer-events-none text-muted-foreground",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
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
