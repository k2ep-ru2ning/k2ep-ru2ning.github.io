import Link from "next/link";
import { paths } from "@/config/paths";
import { type Post } from "@/types/posts";
import { formatDate } from "@/utils/format-date";
import { TagLink } from "../tags/tag-link";
import { TagList } from "../tags/tag-list";
import { Heading } from "../ui/heading";

type Props = {
  postsOnSeries: Post[];
};

export function PostListOnSeries({ postsOnSeries }: Props) {
  if (postsOnSeries.length === 0) {
    return <p>시리즈에 속한 글이 없습니다.</p>;
  }

  return (
    <ul className="flex flex-col gap-8">
      {postsOnSeries.map((post, idx) => (
        <li key={post.id}>
          <div className="inline-block min-w-12 rounded-t-md border border-b-0 border-border px-2 py-0.5 font-bold text-2xl after:content-['.']">
            {idx + 1}
          </div>
          <div className="p-2 flex flex-col gap-3 rounded-b-md border border-border">
            <Link
              href={paths.post.getHref(post.id)}
              className="flex flex-col gap-3 hover:text-brand transition-colors"
            >
              <Heading as="h3">{post.title}</Heading>
              {post.description.length > 0 ? <p>{post.description}</p> : null}
            </Link>
            <time className="text-sm text-secondary-foreground">
              {formatDate(post.createdAt)}
            </time>
            {post.tags && post.tags.length > 0 ? (
              <TagList>
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <TagLink tag={tag} />
                  </li>
                ))}
              </TagList>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
