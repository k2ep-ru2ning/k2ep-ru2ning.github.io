import { Heading } from "@/components/heading";
import { TagLink } from "@/components/tags/tag-link";
import { TagList } from "@/components/tags/tag-list";
import { type Post } from "@/schema/posts";
import { formatDate } from "@/utils/format-date";

type Props = {
  post: Post;
};

export function PostArticleHeader({ post }: Props) {
  return (
    <header className="flex flex-col gap-y-4">
      <Heading as="h1" className="sm:text-4xl">
        {post.title}
      </Heading>
      {post.tags && post.tags.length > 0 ? (
        <TagList>
          {post.tags.map((tag) => (
            <li key={tag}>
              <TagLink tag={tag} />
            </li>
          ))}
        </TagList>
      ) : null}
      <time className="text-sm text-secondary-foreground">
        {formatDate(post.createdAt)} 작성
      </time>
    </header>
  );
}
