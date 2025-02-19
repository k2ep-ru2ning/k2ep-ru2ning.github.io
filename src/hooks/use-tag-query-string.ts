import { useSearchParams } from "next/navigation";

type TagQueryString =
  | {
      result: "selectAll";
    }
  | {
      result: "selectTag";
      value: string;
    }
  | {
      result: "invalid";
      reason: string;
    };

export default function useTagQueryString(): TagQueryString {
  const searchParams = useSearchParams();

  const tagQueryStrings = searchParams.getAll("tag");

  // '/posts?tag=algorithm&tag=React'
  if (tagQueryStrings.length >= 2) {
    return {
      result: "invalid",
      reason: `tag query string[${tagQueryStrings.join(",")}]이 2개 이상입니다.`,
    };
  }

  // '/posts'
  if (tagQueryStrings.length === 0) {
    return {
      result: "selectAll",
    };
  }

  // '/posts?tag' or '/posts?tag='
  if (tagQueryStrings[0] === "") {
    return {
      result: "selectAll",
    };
  }

  return {
    result: "selectTag",
    value: tagQueryStrings[0],
  };
}
