import { type Post } from "@/schema/posts";
import formatDate from "@/utils/format-date";
import TagLink from "../tags/tag-link";
import TagList from "../tags/tag-list";

type Props = {
  post: Post;
};

export default function PostArticleHeader({ post }: Props) {
  return (
    <header className="flex flex-col gap-y-4">
      <h1 className="text-3xl sm:text-4xl font-bold">{post.title}</h1>
      {post.tags && post.tags.length > 0 ? (
        <TagList>
          {post.tags.map((tag) => (
            <li key={tag}>
              <TagLink tag={tag} link={`/posts?tag=${tag}`} />
            </li>
          ))}
        </TagList>
      ) : null}
      <time className="text-sm text-zinc-700 dark:text-zinc-300">
        {formatDate(post.createdAt)} 작성
      </time>
    </header>
  );
}
