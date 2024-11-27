import { type Heading } from "@/utils/mdx";
import PostArticleTOCItem from "./post-article-toc-item";
import HorizontalSeparator from "../separator/horizontal-separator";

type Props = {
  headings: Heading[];
};

export default function PostArticleTOCSidebar({ headings }: Props) {
  return (
    <section className="max-h-[calc(100dvh-172px)] sticky top-20 border border-zinc-300 dark:border-zinc-700 p-3 flex flex-col gap-3 overflow-auto">
      <h2 className="text-xl">목차</h2>
      <HorizontalSeparator />
      <nav>
        <ul className="flex flex-col gap-1.5">
          {headings.map((item) => (
            <PostArticleTOCItem key={item.id} item={item} />
          ))}
        </ul>
      </nav>
    </section>
  );
}
