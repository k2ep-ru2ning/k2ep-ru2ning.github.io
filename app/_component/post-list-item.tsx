import Link from "next/link";
import { formatDate } from "../_lib/date-formatter";
import { type Post } from "../_lib/post";

type Props = {
  post: Post;
};

export default function PostListItem({
  post: { title, description, createdAt, slug },
}: Props) {
  return (
    <li>
      <Link
        href={slug}
        className="group hover:bg-gray-200 dark:hover:bg-gray-700 group px-2 py-4 flex flex-col md:flex-row md:gap-x-8"
      >
        <time className="shrink-0 text-sm leading-8">
          {formatDate(createdAt)}
        </time>
        <section className="grow overflow-hidden flex flex-col gap-3">
          <h3 className="group-hover:underline decoration-indigo-500 underline-offset-6 leading-8 font-bold text-xl truncate">
            {title}
          </h3>
          <p className="truncate">{description}</p>
        </section>
      </Link>
    </li>
  );
}
