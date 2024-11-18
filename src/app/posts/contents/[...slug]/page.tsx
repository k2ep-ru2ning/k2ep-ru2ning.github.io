import { type Metadata } from "next";
import { notFound } from "next/navigation";
import PostArticleContent from "@/components/post-article/post-article-content";
import PostArticleHeader from "@/components/post-article/post-article-header";
import HorizontalSeparator from "@/components/separator/horizontal-separator";
import { getPostByAbsoluteUrl, getPosts } from "@/service/post";

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
