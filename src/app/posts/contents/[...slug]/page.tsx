import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { LuPenSquare } from "react-icons/lu";
import PostArticleHeading from "@/components/post-article-mdx/post-article-heading";
import PostArticleImage from "@/components/post-article-mdx/post-article-image";
import PostArticleStickyTOCSidebar from "@/components/post-article-toc/post-article-sticky-toc-sidebar";
import HorizontalSeparator from "@/components/separator/horizontal-separator";
import TagList from "@/components/tag-list";
import { getPostByAbsoluteUrl, getPosts } from "@/service/post";
import { formatDate } from "@/utils/date-formatter";
import {
  extractHeadingsFromMDXString,
  generateComponentFromMDXString,
} from "@/utils/mdx";

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

  const MDXComponent = await generateComponentFromMDXString(post.content);

  const headingsOfPost = await extractHeadingsFromMDXString(post.content);

  return (
    <article className="flex flex-col gap-y-6">
      <header className="flex flex-col gap-y-4 sm:gap-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{post.title}</h1>
        {post.tags ? <TagList tags={post.tags} /> : null}
        <time className="flex items-center gap-x-1.5 text-sm">
          <LuPenSquare className="size-4" />
          {formatDate(post.createdAt)}
        </time>
      </header>
      <HorizontalSeparator />
      <div className="lg:grid lg:grid-cols-[calc(100%-320px)_320px]">
        <div className="max-w-full prose prose-zinc dark:prose-invert prose-sm sm:prose-base">
          <MDXComponent
            components={{
              Image: PostArticleImage,
              h2: ({ children, id }) => (
                <PostArticleHeading as="h2" id={id}>
                  {children}
                </PostArticleHeading>
              ),
              h3: ({ children, id }) => (
                <PostArticleHeading as="h3" id={id}>
                  {children}
                </PostArticleHeading>
              ),
              h4: ({ children, id }) => (
                <PostArticleHeading as="h4" id={id}>
                  {children}
                </PostArticleHeading>
              ),
            }}
          />
        </div>
        {/* 
          아래 div에 sticky를 주면 안된다. 
          이 div는 부모 요소 height를 다 차지하고 있어서,
          가장 가까운 scroll box인 뷰포트에서 스크롤이 일어나도
          sticky하게 움직일 공간이 없다. 
          그래서 TOC 컴포넌트에 sticky를 준다.
        */}
        <div className="pl-5 hidden lg:block">
          <PostArticleStickyTOCSidebar headings={headingsOfPost} />
        </div>
      </div>
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
