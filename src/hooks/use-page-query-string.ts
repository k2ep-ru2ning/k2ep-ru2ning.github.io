import { useSearchParams } from "next/navigation";

type PageQueryStringParsingResult =
  | {
      isValid: true;
      value: string;
    }
  | {
      isValid: false;
      reason: string;
    };

export default function usePageQueryString(): PageQueryStringParsingResult {
  const searchParams = useSearchParams();

  const pageQueryStrings = searchParams.getAll("page");

  if (pageQueryStrings.length >= 2) {
    return {
      isValid: false,
      reason: `page query string[${pageQueryStrings.join(",")}]이 2개 이상입니다.`,
    };
  }

  if (pageQueryStrings.length === 0) {
    return {
      isValid: true,
      value: "1",
    };
  }

  if (pageQueryStrings[0] === "") {
    return {
      isValid: true,
      value: "1",
    };
  }

  if (!/^[-+]?\d+$/.test(pageQueryStrings[0])) {
    return {
      isValid: false,
      reason: `page query string("${pageQueryStrings[0]}")이 정수로 파싱할 수 있는 문자열이 아닙니다.`,
    };
  }

  return {
    isValid: true,
    value: pageQueryStrings[0],
  };
}
