import { type ComponentProps } from "react";
import { cn } from "@/utils/cn";

export function PostList({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("flex flex-col", className)} {...props} />;
}
