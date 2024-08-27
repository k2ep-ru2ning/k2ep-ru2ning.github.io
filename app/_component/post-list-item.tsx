import Link from "next/link";
import { formatDate } from "../_lib/date-formatter";
import { type Post } from "../_lib/post";

type Props = {
  post: Post;
};

export default function PostListItem({
  post: { title, description, createdAt, path, tags },
}: Props) {
  return (
    <li>
      <section className="py-4 flex flex-col md:flex-row md:gap-x-8">
        <time className="shrink-0 text-sm leading-8">
          {formatDate(createdAt)}
        </time>
        <div className="flex flex-col overflow-hidden gap-3 md:grow">
          <Link href={path} className="group flex flex-col gap-3">
            <h3 className="group-hover:underline decoration-indigo-500 underline-offset-6 leading-8 font-bold text-xl truncate">
              {title}
            </h3>
            <p className="truncate">{description}</p>
          </Link>
          {tags ? (
            <div className="flex flex-wrap gap-3 items-center">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="block px-2 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </li>
  );
}
