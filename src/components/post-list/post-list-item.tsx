import Link from "next/link";
import { type Post } from "@/service/posts";
import { formatDate } from "@/utils/date-formatter";
import TagList from "../tag-list";

type Props = {
  post: Post;
};

export default function PostListItem({
  post: { title, description, createdAt, absoluteUrl, tags },
}: Props) {
  return (
    <li>
      <section className="flex flex-col md:flex-row md:gap-x-8">
        <time className="text-sm leading-8 md:shrink-0">
          {formatDate(createdAt)}
        </time>
        <div className="flex flex-col gap-3 md:grow">
          <Link
            href={absoluteUrl}
            className="flex flex-col gap-3 hover:text-indigo-500 transition-colors"
          >
            <h3 className="leading-8 font-bold text-lg sm:text-xl">{title}</h3>
            {description.length > 0 ? (
              <p className="text-sm sm:text-base">{description}</p>
            ) : null}
          </Link>
          {tags ? <TagList tags={tags} /> : null}
        </div>
      </section>
    </li>
  );
}
