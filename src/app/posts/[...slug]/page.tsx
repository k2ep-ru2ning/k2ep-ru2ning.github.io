import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { FixedScrollToTopButton } from "@/components/posts/article/fixed-scroll-to-top-button";
import { PostArticleContent } from "@/components/posts/article/post-article-content";
import { PostArticleHeader } from "@/components/posts/article/post-article-header";
import { Separator } from "@/components/ui/separator";
import { getPostById, getPosts } from "@/service/posts";

type Slug = string[];

type Props = {
  params: Promise<{
    slug: Slug;
  }>;
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <FixedScrollToTopButton />
      <article className="flex flex-col gap-y-6">
        <PostArticleHeader post={post} />
        <Separator />
        <PostArticleContent post={post} />
      </article>
    </>
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((posts) => ({
    slug: posts.id.split("/"),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

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
  // next가 넣어주는 slug params가 디코드 된 상태가 아니기 때문에 직접 url decoding.
  return getPostById(slug.map(decodeURIComponent).join("/"));
}
