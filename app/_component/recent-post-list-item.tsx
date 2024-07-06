import Link from "next/link";
import { formatDate } from "../_lib/date-formatter";
import { type Post } from "../_lib/post";

type Props = {
  post: Post;
};

export default function RecentPostListItem({
  post: { title, description, createdAt, slug },
}: Props) {
  return (
    <Link href={slug}>
      <li className="py-4 flex gap-8 text-gray-950 dark:text-gray-50">
        <time className="shrink-0 text-sm">{formatDate(createdAt)}</time>
        <section className="grow overflow-hidden flex flex-col gap-3">
          <h3 className="font-bold text-xl truncate">{title}</h3>
          <p className="truncate">{description}</p>
        </section>
      </li>
    </Link>
  );
}
