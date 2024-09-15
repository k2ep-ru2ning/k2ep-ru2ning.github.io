import { SquarePen } from "lucide-react";
import { formatDate } from "@/app/_lib/date-formatter";
import { Post } from "@/app/_lib/post";
import TagList from "@/app/_component/tag-list";

type Props = Pick<Post, "title" | "createdAt" | "tags">;

export default function PostArticleHeader({ title, createdAt, tags }: Props) {
  return (
    <header className="flex flex-col gap-y-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {tags ? <TagList tags={tags} /> : null}
      <time className="flex items-center gap-x-1.5 text-sm">
        <SquarePen size={18} />
        {formatDate(createdAt)}
      </time>
    </header>
  );
}
