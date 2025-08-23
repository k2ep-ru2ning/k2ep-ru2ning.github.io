import Link from "next/link";
import { paths } from "@/config/paths";
import { type Post } from "@/schema/posts";
import { formatDate } from "@/utils/format-date";
import Heading from "../heading";
import Tag from "../tags/tag";
import TagList from "../tags/tag-list";

type Props = {
  post: Post;
};

export default function PostListItem({
  post: { title, description, createdAt, id, tags },
}: Props) {
  return (
    <li className="py-6 sm:py-8 border-b first:border-t border-border">
      <Link
        href={paths.post.getHref(id)}
        className="group flex flex-col md:flex-row md:gap-x-8"
      >
        <time className="text-sm text-secondary-foreground leading-8 md:shrink-0 group-hover:text-brand transition-colors">
          {formatDate(createdAt)}
        </time>
        <div className="flex flex-col gap-3 md:grow">
          <div className="flex flex-col gap-3 group-hover:text-brand transition-colors">
            <Heading as="h3" className="leading-8">
              {title}
            </Heading>
            {description.length > 0 ? (
              <p className="whitespace-pre-wrap">{description}</p>
            ) : null}
          </div>
          {tags && tags.length > 0 ? (
            <TagList>
              {tags.map((tag) => (
                <li key={tag}>
                  <Tag
                    tag={tag}
                    className="group-hover:text-brand transition-colors"
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
