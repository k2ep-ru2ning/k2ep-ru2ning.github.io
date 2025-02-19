import { useSearchParams } from "next/navigation";

type Result =
  | {
      isValid: true;
      value: string;
    }
  | {
      isValid: false;
      reason: string;
    };

export default function usePageSearchParam(): Result {
  const searchParams = useSearchParams();

  const pageSearchParams = searchParams.getAll("page");

  if (pageSearchParams.length >= 2) {
    return {
      isValid: false,
      reason: `page searchParams[${pageSearchParams.join(",")}]가 2개 이상입니다.`,
    };
  }

  if (pageSearchParams.length === 0) {
    return {
      isValid: true,
      value: "1",
    };
  }

  if (pageSearchParams[0] === "") {
    return {
      isValid: true,
      value: "1",
    };
  }

  if (!/^[-+]?\d+$/.test(pageSearchParams[0])) {
    return {
      isValid: false,
      reason: `page searchParam("${pageSearchParams[0]}")이 정수로 파싱할 수 있는 문자열이 아닙니다.`,
    };
  }

  return {
    isValid: true,
    value: pageSearchParams[0],
  };
}
