import { type Metadata } from "next";
import { Suspense } from "react";
import ListHeading from "@/components/list-heading";
import FilterablePostList from "@/components/posts/filterable-post-list";
import Section from "@/components/section";
import { getPosts } from "@/service/posts";
import { getTags } from "@/service/tags";

export default async function PostsPage() {
  const [posts, tags] = await Promise.all([getPosts(), getTags()]);

  return (
    <Section>
      <ListHeading>글</ListHeading>
      <Suspense>
        <FilterablePostList posts={posts} tags={tags} />
      </Suspense>
    </Section>
  );
}

export const metadata: Metadata = {
  title: "글",
  description: "글 목록 페이지입니다.",
};
