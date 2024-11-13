import { LuPenSquare } from "react-icons/lu";
import TagList from "@/_component/tag-list";
import { formatDate } from "@/_lib/date-formatter";
import { Post } from "@/_lib/post";

type Props = Pick<Post, "title" | "createdAt" | "tags">;

export default function PostArticleHeader({ title, createdAt, tags }: Props) {
  return (
    <header className="flex flex-col gap-y-4 sm:gap-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
      {tags ? <TagList tags={tags} /> : null}
      <time className="flex items-center gap-x-1.5 text-sm">
        <LuPenSquare className="size-4" />
        {formatDate(createdAt)}
      </time>
    </header>
  );
}
