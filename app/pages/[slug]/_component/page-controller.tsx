import cn from "@/app/_lib/cn";
import Link from "next/link";

type Props = {
  currentPageNumber: number;
  numberOfPages: number;
};

export default function PageController({
  currentPageNumber,
  numberOfPages,
}: Props) {
  const pageNumbers = Array.from(
    { length: numberOfPages },
    (_, idx) => idx + 1,
  );

  return (
    <div className="p-4 flex items-center justify-center gap-2">
      {pageNumbers.map((pageNumber) => (
        <Link
          href={`/pages/${pageNumber}`}
          key={pageNumber}
          className={cn(
            "border border-gray-300 dark:border-gray-600 rounded-md px-2",
            pageNumber === currentPageNumber && "font-bold text-indigo-500",
          )}
        >
          {pageNumber}
        </Link>
      ))}
    </div>
  );
}
