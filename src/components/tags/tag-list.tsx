import { type ComponentProps } from "react";
import { cn } from "@/utils";

export default function TagList({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-wrap gap-2 items-center", className)}
      {...props}
    />
  );
}
