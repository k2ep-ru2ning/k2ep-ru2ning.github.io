import { type ComponentProps } from "react";
import { cn } from "@/utils/cn";

export function TagList({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-wrap gap-2 items-center", className)}
      {...props}
    />
  );
}
