import { useSearchParams } from "next/navigation";

export default function usePageSearchParam(maxPageNumber: number): number {
  const searchParams = useSearchParams();

  // page search param이 두 개이상 있는 경우에는 첫 번째 page search param 값을 이용한다.
  // 두 개이상인 경우에 대해 별도의 예외처리 하지 않는다.
  const pageSearchParam = searchParams.get("page");

  if (pageSearchParam === null) {
    return 1;
  }

  if (!/^\d+$/.test(pageSearchParam)) {
    return 1;
  }

  let pageNumber = Number(pageSearchParam);

  if (pageNumber < 1) {
    pageNumber = 1;
  }

  if (pageNumber > maxPageNumber) {
    pageNumber = maxPageNumber;
  }

  return pageNumber;
}
