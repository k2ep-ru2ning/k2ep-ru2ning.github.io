import Link from "next/link";
import { TagLink } from "@/components/tags/tag-link";
import { TagList } from "@/components/tags/tag-list";
import { Heading } from "@/components/ui/heading";
import { paths } from "@/config/paths";
import { type Post } from "@/types/posts";
import { formatDate } from "@/utils/format-date";

type Props = {
  post: Post;
};

export function PostArticleHeader({ post }: Props) {
  return (
    <header className="max-w-(--content-max-width) mx-auto px-(--content-horizontal-padding) flex flex-col gap-y-4">
      <Heading as="h1">
        <Link href={paths.post.getHref(post.id)}>{post.title}</Link>
      </Heading>
      <ul className="text-sm text-secondary-foreground sm:flex sm:items-center">
        <li>
          <time>{formatDate(post.createdAt)}</time> 작성
        </li>
        {post.updatedAt && (
          <li className="sm:before:content-['·'] sm:before:mr-1 sm:ml-1">
            <time>{formatDate(post.updatedAt)}</time> 수정
          </li>
        )}
      </ul>
      {post.tags && post.tags.length > 0 ? (
        <TagList>
          {post.tags.map((tag) => (
            <li key={tag}>
              <TagLink tag={tag} />
            </li>
          ))}
        </TagList>
      ) : null}
    </header>
  );
}
