import { notFound } from "next/navigation";
import { getPostByPath } from "@/app/_lib/post";
import PostArticleHeader from "./_component/post-article-header";

type Props = {
  params: {
    slug: string[];
  };
};

export default async function PostPage({ params: { slug } }: Props) {
  const path = `/posts/${slug.map(decodeURIComponent).join("/")}`;

  const post = await getPostByPath(path);

  if (!post) {
    notFound();
  }

  return (
    <article className="p-2">
      <PostArticleHeader title={post.title} createdAt={post.createdAt} />
    </article>
  );
}
