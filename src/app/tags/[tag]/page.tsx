import { Metadata } from "next";
import { notFound } from "next/navigation";
import ListHeading from "@/components/list-heading";
import PostList from "@/components/post-list";
import { getSortedPostsByTag, getTags } from "@/service/post";

type Props = {
  params: {
    tag: string;
  };
};

export default async function PostListInTagPage({ params }: Props) {
  const tag = decodeURIComponent(params.tag);

  const posts = await getSortedPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <section className="py-3 md:py-4 flex flex-col gap-2">
      <ListHeading text={`태그 "${tag}"에 속한 글 목록`} />
      <PostList posts={posts} />
    </section>
  );
}

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params: { tag },
}: Props): Promise<Metadata> {
  tag = decodeURIComponent(tag);

  const posts = await getSortedPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return {
    title: `${tag} 태그`,
    description: `태그 "${tag}"에 속한 글 목록입니다.`,
  };
}