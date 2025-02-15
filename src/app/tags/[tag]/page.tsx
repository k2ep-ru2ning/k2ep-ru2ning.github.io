import { type Metadata } from "next";
import { notFound } from "next/navigation";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import PostList from "@/components/post-list";
import { getPostsByTag } from "@/service/posts";
import { getTags, getTagSet } from "@/service/tags";

type Props = {
  params: Promise<{
    tag: string;
  }>;
};

export default async function TagDetailPage({ params }: Props) {
  const tag = decodeURIComponent((await params).tag);

  const tagSet = await getTagSet();

  // valid한 태그 이름이 아닌 경우.
  if (!tagSet.has(tag)) {
    notFound();
  }

  const postsOnTag = await getPostsByTag(tag);

  return (
    <ListSection>
      <ListHeading>
        &quot;
        <strong className="underline decoration-wavy decoration-indigo-500">
          {tag}
        </strong>
        &quot; 태그
      </ListHeading>
      <PostList posts={postsOnTag} />
    </ListSection>
  );
}

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = decodeURIComponent((await params).tag);

  const tagSet = await getTagSet();

  // valid한 태그 이름이 아닌 경우.
  if (!tagSet.has(tag)) {
    notFound();
  }

  return {
    title: `"${tag}" 태그`,
    description: `"${tag}" 태그에 속한 글 목록입니다.`,
  };
}
