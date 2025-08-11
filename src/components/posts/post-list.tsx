import { type ComponentProps } from "react";
import { cn } from "@/utils";

export default function PostList({
  className,
  ...props
}: ComponentProps<"ul">) {
  return <ul className={cn("flex flex-col", className)} {...props} />;
}
