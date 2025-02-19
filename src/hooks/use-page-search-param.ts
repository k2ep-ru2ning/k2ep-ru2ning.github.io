import { useSearchParams } from "next/navigation";

export default function usePageSearchParam(): string {
  const searchParams = useSearchParams();

  const pageSearchParams = searchParams.getAll("page");

  if (pageSearchParams.length >= 2) {
    throw new Error(
      `page searchParams[${pageSearchParams.join(",")}]가 2개 이상입니다.`,
    );
  }

  if (pageSearchParams.length === 0) {
    return "1";
  }

  if (pageSearchParams[0] === "") {
    return "1";
  }

  if (!/^[-+]?\d+$/.test(pageSearchParams[0])) {
    throw new Error(
      `page searchParam("${pageSearchParams[0]}")이 정수로 파싱할 수 있는 문자열이 아닙니다.`,
    );
  }

  return pageSearchParams[0];
}
