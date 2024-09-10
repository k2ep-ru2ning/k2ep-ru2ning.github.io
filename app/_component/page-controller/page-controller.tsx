import cn from "@/app/_lib/cn";
import Link from "next/link";
import PreviousButton from "./previous-button";
import NextButton from "./next-button";

type Props = {
  currentPageNumber: number;
  numberOfPages: number;
  basePath: string;
};

const CONTROLLER_SIZE = 5;

export default function PageController({
  currentPageNumber,
  numberOfPages,
  basePath,
}: Props) {
  const pageNumbers = getPageNumbers(currentPageNumber, numberOfPages);

  return (
    <nav>
      <ul className="p-4 flex items-center justify-center gap-2">
        <li>
          <PreviousButton
            basePath={basePath}
            currentPageNumber={currentPageNumber}
          />
        </li>
        {pageNumbers.map((pageNumber) => (
          <li key={pageNumber}>
            <Link
              href={`${basePath}/${pageNumber}`}
              className={cn(
                "w-7 h-7 flex justify-center items-center border border-gray-300 dark:border-gray-700 rounded-md px-2",
                pageNumber === currentPageNumber && "font-bold text-indigo-500",
              )}
            >
              {pageNumber}
            </Link>
          </li>
        ))}
        <li>
          <NextButton
            basePath={basePath}
            currentPageNumber={currentPageNumber}
            numberOfPages={numberOfPages}
          />
        </li>
      </ul>
    </nav>
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
