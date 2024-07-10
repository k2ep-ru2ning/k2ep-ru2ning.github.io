import { SquarePen } from "lucide-react";
import { formatDate } from "@/app/_lib/date-formatter";

type Props = {
  title: string;
  createdAt: Date;
};

export default function PostArticleHeader({ title, createdAt }: Props) {
  return (
    <header className="flex flex-col gap-y-2">
      <h2 className="text-3xl font-bold">{title}</h2>
      <time className="flex items-center gap-x-1.5 text-sm">
        <SquarePen size={18} />
        {formatDate(createdAt)}
      </time>
    </header>
  );
}
