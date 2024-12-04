import { type Post } from "@/service/posts";
import { formatDate } from "@/utils/date-formatter";
import TagList from "../tag-list";

type Props = {
  post: Post;
};

export default function PostArticleHeader({ post }: Props) {
  return (
    <header className="flex flex-col gap-y-4">
      <h1 className="text-3xl sm:text-4xl font-bold">{post.title}</h1>
      {post.tags ? <TagList tags={post.tags} /> : null}
      <time className="text-sm text-zinc-700 dark:text-zinc-300">
        {formatDate(post.createdAt)} 작성
      </time>
    </header>
  );
}
