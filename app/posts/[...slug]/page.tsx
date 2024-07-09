import { notFound } from "next/navigation";
import { getPostByPath } from "@/app/_lib/post";

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
    <article>
      <p>{post.title}</p>
      <p>{post.path}</p>
    </article>
  );
}
