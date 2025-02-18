import { type Metadata } from "next";
import { Suspense } from "react";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import FilterablePostList from "@/components/posts/filterable-post-list";
import { getPosts } from "@/service/posts";
import { getTags } from "@/service/tags";

export default async function PostsPage() {
  const [posts, tags] = await Promise.all([getPosts(), getTags()]);

  return (
    <ListSection>
      <ListHeading>글 목록</ListHeading>
      <Suspense>
        <FilterablePostList posts={posts} tags={tags} />
      </Suspense>
    </ListSection>
  );
}

export const metadata: Metadata = {
  title: "글 목록",
  description: "글 목록 페이지입니다.",
};
