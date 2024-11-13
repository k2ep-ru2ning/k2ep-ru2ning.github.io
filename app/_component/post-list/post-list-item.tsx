import Link from "next/link";
import { formatDate } from "@/_lib/date-formatter";
import { Post } from "@/_lib/post";
import TagList from "../tag-list";

type Props = {
  post: Post;
};

export default function PostListItem({
  post: { title, description, createdAt, absoluteUrl, tags },
}: Props) {
  return (
    <li>
      <section className="py-2 sm:py-4 flex flex-col md:flex-row md:gap-x-8">
        <time className="shrink-0 text-sm leading-8">
          {formatDate(createdAt)}
        </time>
        <div className="flex flex-col overflow-hidden gap-3 md:grow">
          <Link href={absoluteUrl} className="group flex flex-col gap-3">
            <h3 className="transition group-hover:text-indigo-500 leading-8 font-bold text-lg sm:text-xl truncate">
              {title}
            </h3>
            <p className="truncate text-sm sm:text-base transition group-hover:text-indigo-500">
              {description}
            </p>
          </Link>
          {tags ? <TagList tags={tags} /> : null}
        </div>
      </section>
    </li>
  );
}
