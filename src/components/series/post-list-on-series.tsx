import Link from "next/link";
import { type Post } from "@/schema/posts";
import formatDate from "@/utils/format-date";
import TagLink from "../tags/tag-link";
import TagList from "../tags/tag-list";

type Props = {
  postsOnSeries: Post[];
};

export default function PostListOnSeries({ postsOnSeries }: Props) {
  if (postsOnSeries.length === 0) {
    return <p>시리즈에 속한 글이 없습니다.</p>;
  }

  return (
    <ul className="flex flex-col gap-8">
      {postsOnSeries.map((post, idx) => (
        <li key={post.absoluteUrl}>
          <div className="inline-block min-w-12 rounded-t-md border border-b-0 border-zinc-300 dark:border-zinc-700 px-2 py-0.5 font-bold text-2xl after:content-['.']">
            {idx + 1}
          </div>
          <div className="p-2 flex flex-col gap-3 rounded-b-md border border-zinc-300 dark:border-zinc-700">
            <Link
              href={post.absoluteUrl}
              className="flex flex-col gap-3 hover:text-indigo-500 transition-colors"
            >
              <h3 className="font-bold text-xl">{post.title}</h3>
              {post.description.length > 0 ? <p>{post.description}</p> : null}
            </Link>
            <time className="text-sm text-zinc-700 dark:text-zinc-300">
              {formatDate(post.createdAt)}
            </time>
            {post.tags && post.tags.length > 0 ? (
              <TagList>
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <TagLink tag={tag} link={`/posts?tag=${tag}`} />
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
