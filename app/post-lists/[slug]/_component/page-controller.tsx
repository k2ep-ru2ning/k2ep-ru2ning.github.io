import cn from "@/app/_lib/cn";
import Link from "next/link";
import NavButton from "./nav-button";

type Props = {
  currentPageNumber: number;
  numberOfPages: number;
};

const CONTROLLER_SIZE = 5;

export default function PageController({
  currentPageNumber,
  numberOfPages,
}: Props) {
  const pageNumbers = getPageNumbers(currentPageNumber, numberOfPages);

  return (
    <div className="p-4 flex items-center justify-center gap-2">
      <NavButton
        direction="prev"
        currentPageNumber={currentPageNumber}
        numberOfPages={numberOfPages}
      />
      {pageNumbers.map((pageNumber) => (
        <Link
          href={`/post-lists/${pageNumber}`}
          key={pageNumber}
          className={cn(
            "w-7 h-7 flex justify-center items-center border border-gray-300 dark:border-gray-700 rounded-md px-2",
            pageNumber === currentPageNumber && "font-bold text-indigo-500",
          )}
        >
          {pageNumber}
        </Link>
      ))}
      <NavButton
        direction="next"
        currentPageNumber={currentPageNumber}
        numberOfPages={numberOfPages}
      />
    </div>
  );
}

/**
 * currentPageNumber를 가운데 위치시키면서,
 * min(numberOfPages, CONTROLLER_SIZE)개의 페이지 번호 배열을 계산하는 함수.
 */
function getPageNumbers(currentPageNumber: number, numberOfPages: number) {
  // 화면에 표시할, 페이지 번호 버튼 개수.
  const size = Math.min(CONTROLLER_SIZE, numberOfPages);

  const halfSize = Math.floor(size / 2);

  const pageNumbers = Array.from({ length: size }, (_, idx) => {
    const offset = idx - halfSize;
    return currentPageNumber + offset;
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
