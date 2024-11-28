import Link from "next/link";
import { createElement, type PropsWithChildren } from "react";
import { LuLink } from "react-icons/lu";
import cn from "@/utils/cn";

type Props = {
  id?: string;
  as: "h2" | "h3" | "h4";
};

export default function PostArticleHeading({
  id,
  as,
  children,
}: PropsWithChildren<Props>) {
  return createElement(
    // h2, h3, h4에 반복되는 속성이 많아 코드 반복을 줄이기 위해, JSX 대신 createElement 함수를 사용
    as,
    { id, className: "group scroll-mt-20 flex gap-1.5 items-baseline" },
    children,
    <Link
      href={`#${id}`}
      className="hover:bg-zinc-200 dark:hover:bg-zinc-700 hidden group-hover:flex justify-center items-center p-0.5 rounded-md border border-zinc-300 dark:border-zinc-700"
    >
      <LuLink
        className={cn("size-2 sm:size-3", as === "h2" && "size-3 sm:size-4")}
      />
    </Link>,
  );
}
