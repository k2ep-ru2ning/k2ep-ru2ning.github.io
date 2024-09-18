import { notFound } from "next/navigation";
import { getPostByPath, getPosts } from "@/app/_lib/post";
import PostArticleHeader from "./_component/post-article-header";
import PostArticleContent from "./_component/post-article-content";

type Props = {
  params: {
    slug: string[];
  };
};

export default async function PostPage({ params: { slug } }: Props) {
  const path = `/posts/contents/${slug.map(decodeURIComponent).join("/")}`;

  const post = await getPostByPath(path);

  if (!post) {
    notFound();
  }

  return (
    <article className="flex flex-col gap-y-6">
      <PostArticleHeader
        title={post.title}
        createdAt={post.createdAt}
        tags={post.tags}
      />
      <hr className="border border-zinc-500 dark:border-zinc-400" />
      <PostArticleContent contentAsMarkdown={post.content} />
    </article>
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(({ path }) => ({
    slug: path.replace("/posts/contents/", "").split("/"),
  }));
}
