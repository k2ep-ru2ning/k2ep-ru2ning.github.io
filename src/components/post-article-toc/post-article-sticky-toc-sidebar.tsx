import { type Heading } from "@/utils/mdx";
import PostArticleTOCItem from "./post-article-toc-item";
import HorizontalSeparator from "../separator/horizontal-separator";

type Props = {
  headings: Heading[];
};

export default function PostArticleStickyTOCSidebar({ headings }: Props) {
  return (
    // header: h-16(4rem), footer: h-20(5rem), main의 상하패딩 총 3rem
    <section className="max-h-[calc(100dvh-12rem)] sticky top-20 rounded-md border border-zinc-300 dark:border-zinc-700 p-3 flex flex-col gap-3 overflow-hidden">
      <h2 className="text-xl shrink-0">목차</h2>
      <HorizontalSeparator />
      <nav className="flex-grow overflow-auto">
        <ul className="flex flex-col gap-1">
          {headings.map((item) => (
            <PostArticleTOCItem key={item.id} item={item} />
          ))}
        </ul>
      </nav>
    </section>
  );
}
