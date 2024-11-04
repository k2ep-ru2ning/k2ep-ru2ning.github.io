import { notFound } from "next/navigation";
import { getPostByAbsoluteUrl, getPosts } from "@/app/_lib/post";
import PostArticleHeader from "./_component/post-article-header";
import PostArticleContent from "./_component/post-article-content";
import { type Metadata } from "next";
import HorizontalSeparator from "@/app/_component/horizontal-separator";

type Slug = string[];

type Props = {
  params: {
    slug: Slug;
  };
};

export default async function PostPage({ params: { slug } }: Props) {
  const post = await getPostBySlug(slug);

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
      <HorizontalSeparator />
      <PostArticleContent contentAsMarkdown={post.content} />
    </article>
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(({ absoluteUrl }) => ({
    slug: absoluteUrl.replace("/posts/contents/", "").split("/"),
  }));
}

export async function generateMetadata({
  params: { slug },
}: Props): Promise<Metadata> {
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return {
    title: post.title,
    description: post.description,
  };
}

async function getPostBySlug(slug: Slug) {
  const url = `/posts/contents/${slug.map(decodeURIComponent).join("/")}`;
  return getPostByAbsoluteUrl(url);
}
