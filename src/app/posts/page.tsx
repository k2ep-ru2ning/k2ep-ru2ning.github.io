import { type Metadata } from "next";
import { Suspense } from "react";
import { Posts } from "@/components/posts/list/posts";
import { Heading } from "@/components/ui/heading";
import { getPosts } from "@/service/posts";
import { getTags } from "@/service/tags";

export default async function PostsPage() {
  const tags = getTags();

  const posts = await getPosts();

  return (
    <main className="max-w-(--content-max-width) mx-auto px-(--content-horizontal-padding) flex flex-col gap-6">
      <Heading as="h2">글</Heading>
      <Suspense fallback={null}>
        <Posts posts={posts} tags={tags} />
      </Suspense>
    </main>
  );
}

export const metadata: Metadata = {
  title: "글",
  description: "글 목록 페이지입니다.",
};
