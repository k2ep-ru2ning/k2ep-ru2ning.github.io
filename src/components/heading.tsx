import { createElement, type PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

type Props = {
  as: "h1" | "h2" | "h3";
  className?: string;
};

export default function Heading({
  as,
  children,
  className,
}: PropsWithChildren<Props>) {
  return createElement(
    as,
    {
      className: cn(
        "font-bold text-3xl",
        as === "h2" && "text-2xl",
        as === "h3" && "text-xl",
        className,
      ),
    },
    children,
  );
}
