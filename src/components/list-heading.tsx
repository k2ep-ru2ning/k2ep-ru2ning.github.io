import { type PropsWithChildren } from "react";

export default function ListHeading({ children }: PropsWithChildren) {
  return <h2 className="font-bold text-xl sm:text-2xl">{children}</h2>;
}
