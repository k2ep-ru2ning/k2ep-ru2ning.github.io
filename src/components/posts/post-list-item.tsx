import Link from "next/link";
import { type Post } from "@/schema/posts";
import formatDate from "@/utils/format-date";
import Tag from "../tags/tag";
import TagList from "../tags/tag-list";

type Props = {
  post: Post;
};

export default function PostListItem({
  post: { title, description, createdAt, absoluteUrl, tags },
}: Props) {
  return (
    <li>
      <Link
        href={absoluteUrl}
        className="group flex flex-col md:flex-row md:gap-x-8"
      >
        <time className="text-sm text-zinc-700 dark:text-zinc-300 leading-8 md:shrink-0 group-hover:text-indigo-500 transition-colors">
          {formatDate(createdAt)}
        </time>
        <div className="flex flex-col gap-3 md:grow">
          <div className="flex flex-col gap-3 group-hover:text-indigo-500 transition-colors">
            <h3 className="leading-8 font-bold text-xl">{title}</h3>
            {description.length > 0 ? <p>{description}</p> : null}
          </div>
          {tags && tags.length > 0 ? (
            <TagList>
              {tags.map((tag) => (
                <li key={tag}>
                  <Tag
                    tag={tag}
                    className="group-hover:bg-zinc-300 dark:group-hover:bg-zinc-600 transition-colors"
                  />
                </li>
              ))}
            </TagList>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
