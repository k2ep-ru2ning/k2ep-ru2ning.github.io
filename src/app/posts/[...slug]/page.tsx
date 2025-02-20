import { type Metadata } from "next";
import { notFound } from "next/navigation";
import PostArticleContent from "@/components/post-article/content/post-article-content";
import FixedScrollToTopButton from "@/components/post-article/fixed-scroll-to-top-button";
import PostArticleHeader from "@/components/post-article/post-article-header";
import PostArticleTOC from "@/components/post-article/toc/post-article-toc";
import PostArticleTOCSidebar from "@/components/post-article/toc/post-article-toc-sidebar";
import HorizontalSeparator from "@/components/separator/horizontal-separator";
import { getPostByAbsoluteUrl, getPosts } from "@/service/posts";

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
        <div className="lg:hidden">
          <PostArticleTOC headings={post.headings} />
        </div>
        <HorizontalSeparator />
        <div className="lg:grid lg:grid-cols-[calc(100%-320px)_320px]">
          <PostArticleContent post={post} />
          {/* 
          아래 div에 sticky를 주면 안된다. 
          이 div는 부모 요소 height를 다 차지하고 있어서,
          가장 가까운 scroll box인 뷰포트에서 스크롤이 일어나도
          sticky하게 움직일 공간이 없다. 
          그래서 TOC 컴포넌트를 감싸는 div에 sticky를 준다.
        */}
          <div className="pl-5 hidden lg:block">
            {/* header: 64px, footer: 80px, main의 상하패딩 총 3rem */}
            <div className="sticky top-20 h-full max-h-[calc(100dvh-144px-3rem)] overflow-hidden">
              <PostArticleTOCSidebar headings={post.headings} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(({ absoluteUrl }) => ({
    slug: absoluteUrl.replace("/posts/", "").split("/"),
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
  const url = `/posts/${slug.map(decodeURIComponent).join("/")}`;
  return getPostByAbsoluteUrl(url);
}
