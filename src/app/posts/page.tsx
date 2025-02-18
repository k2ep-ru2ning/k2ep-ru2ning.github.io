import { type Metadata } from "next";
import { Suspense } from "react";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import FilterablePostList from "@/components/posts/filterable-post-list";
import { getPosts } from "@/service/posts";

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <ListSection>
      <ListHeading>글 목록</ListHeading>
      <Suspense>
        <FilterablePostList posts={posts} />
      </Suspense>
    </ListSection>
  );
}

export const metadata: Metadata = {
  title: "글 목록",
  description: "글 목록 페이지입니다.",
};
