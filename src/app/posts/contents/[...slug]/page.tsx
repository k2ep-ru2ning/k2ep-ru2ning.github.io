import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { LuPenSquare } from "react-icons/lu";
import RoundedImage from "@/components/mdx/rounded-image";
import PostArticleTOC from "@/components/post-article-toc";
import HorizontalSeparator from "@/components/separator/horizontal-separator";
import TagList from "@/components/tag-list";
import { getPostByAbsoluteUrl, getPosts } from "@/service/post";
import { formatDate } from "@/utils/date-formatter";
import { generateComponentFromMDXString } from "@/utils/mdx";

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
      <div className="flex gap-5">
        <div className="prose prose-zinc dark:prose-invert prose-sm sm:prose-base prose-code:text-sm sm:prose-code:text-base max-w-full">
          <MDXComponent components={{ Image: RoundedImage }} />
        </div>
        {/* 
          아래 div에 sticky를 주면 안된다. 
          이 div는 부모 flex 컨테이너 height를 다 차지하고 있어서,
          가장 가까운 scroll box인 뷰포트에서 스크롤이 일어나도
          sticky하게 움직일 공간이 없다. 
          그래서 PostArticleTOC를 감싸는 div를 만들고 sticky를 준다.
        */}
        <div className="shrink-0">
          <div className="sticky top-20">
            <PostArticleTOC />
          </div>
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
