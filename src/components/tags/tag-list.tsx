import { type ComponentProps } from "react";
import cn from "@/utils/cn";

export default function TagList({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-wrap gap-3 items-center", className)}
      {...props}
    />
  );
}
