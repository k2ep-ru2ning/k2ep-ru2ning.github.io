import { LuPenSquare } from "react-icons/lu";
import { type Post } from "@/service/posts";
import { formatDate } from "@/utils/date-formatter";
import TagList from "../tag-list";

type Props = {
  post: Post;
};

export default function PostArticleHeader({ post }: Props) {
  return (
    <header className="flex flex-col gap-y-4 sm:gap-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">{post.title}</h1>
      {post.tags ? <TagList tags={post.tags} /> : null}
      <time className="flex items-center gap-x-1.5 text-sm">
        <LuPenSquare className="size-4" />
        {formatDate(post.createdAt)}
      </time>
    </header>
  );
}
