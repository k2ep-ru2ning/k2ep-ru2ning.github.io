import { type ComponentProps, createElement } from "react";
import { cn } from "@/utils/cn";

type H1Props = {
  as: "h1";
} & ComponentProps<"h1">;

type H2Props = {
  as: "h2";
} & ComponentProps<"h2">;

type H3Props = {
  as: "h3";
} & ComponentProps<"h3">;

type Props = H1Props | H2Props | H3Props;

export function Heading({ as, children, className, ...props }: Props) {
  return createElement(
    as,
    {
      ...props,
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
