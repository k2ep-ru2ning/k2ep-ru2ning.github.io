import Link from "next/link";
import { createElement, type PropsWithChildren } from "react";
import { LuLink } from "react-icons/lu";
import { type PostContentHeadingType } from "@/service/posts";

type Props = {
  id?: string;
  as: PostContentHeadingType;
};

export default function PostArticleHeading({
  id,
  as,
  children,
}: PropsWithChildren<Props>) {
  return createElement(
    as, // h2, h3에 반복되는 속성이 많아 코드 반복을 줄이기 위해, JSX 대신 createElement 함수를 사용
    { id, className: "scroll-mt-20" },
    <Link href={`#${id}`} className="inline-block group no-underline">
      {children}
      {/* :focus-visible은 오직 키보드를 통해서 focus 된 요소를 선택, 즉 마우스 클릭이나 스크린 터치로 요소에 focus를 준 경우는 선택 안함 */}
      <div className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 ml-1 inline-flex justify-center items-center p-0.5 sm:p-1 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700">
        <LuLink className="size-3" />
      </div>
    </Link>,
  );
}
