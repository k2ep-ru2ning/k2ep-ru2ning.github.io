import Link from "next/link";
import { type Post } from "@/schema/posts";
import formatDate from "@/utils/format-date";
import TagList from "../tags/tag-list";
import TagListItem from "../tags/tag-list-item";

type Props = {
  post: Post;
};

export default function PostListItem({
  post: { title, description, createdAt, absoluteUrl, tags },
}: Props) {
  return (
    <li>
      <section className="flex flex-col md:flex-row md:gap-x-8">
        <time className="text-sm text-zinc-700 dark:text-zinc-300 leading-8 md:shrink-0">
          {formatDate(createdAt)}
        </time>
        <div className="flex flex-col gap-3 md:grow">
          <Link
            href={absoluteUrl}
            className="flex flex-col gap-3 hover:text-indigo-500 transition-colors"
          >
            <h3 className="leading-8 font-bold text-xl">{title}</h3>
            {description.length > 0 ? <p>{description}</p> : null}
          </Link>
          {tags && tags.length > 0 ? (
            <TagList>
              {tags.map((tag) => (
                <TagListItem key={tag} tag={tag} link={`/posts?tag=${tag}`} />
              ))}
            </TagList>
          ) : null}
        </div>
      </section>
    </li>
  );
}
