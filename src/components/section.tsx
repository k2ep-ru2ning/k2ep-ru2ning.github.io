import { type ComponentProps } from "react";
import { cn } from "@/utils/cn";

export default function Section({
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn("py-3 md:py-4 flex flex-col gap-6 sm:gap-8", className)}
      {...props}
    />
  );
}
