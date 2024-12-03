import { type PropsWithChildren } from "react";

export default function ListSection({ children }: PropsWithChildren) {
  return (
    <section className="py-3 md:py-4 flex flex-col gap-6 sm:gap-8">
      {children}
    </section>
  );
}
