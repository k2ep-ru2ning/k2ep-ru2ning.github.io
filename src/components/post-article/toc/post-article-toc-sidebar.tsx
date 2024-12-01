import { type PostContentHeading } from "@/service/posts";
import PostArticleTOCItem from "./post-article-toc-item";
import HorizontalSeparator from "../../separator/horizontal-separator";

type Props = {
  headings: PostContentHeading[];
};

export default function PostArticleTOCSidebar({ headings }: Props) {
  return (
    <section className="max-h-full rounded-md border border-zinc-300 dark:border-zinc-700 p-3 flex flex-col gap-3">
      <h2 className="text-lg shrink-0">목차</h2>
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
