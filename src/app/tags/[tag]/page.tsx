import { type Metadata } from "next";
import { notFound } from "next/navigation";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import PostList from "@/components/post-list";
import { getPostsByTag } from "@/service/posts";
import { getTags, getTagSet } from "@/service/tags";

type Props = {
  params: {
    tag: string;
  };
};

export default async function TagDetailPage({ params }: Props) {
  const tag = decodeURIComponent(params.tag);

  const tagSet = await getTagSet();

  // valid한 태그 이름이 아닌 경우.
  if (!tagSet.has(tag)) {
    notFound();
  }

  const postsOnTag = await getPostsByTag(tag);

  // valid tag이더라도 실제로 그 태그를 사용하는 글이 없는 경우.
  if (postsOnTag.length === 0) {
    notFound();
  }

  return (
    <ListSection>
      <ListHeading>
        &quot;
        <strong className="underline decoration-wavy decoration-indigo-500">
          {tag}
        </strong>
        &quot; 태그에 속한 글 목록
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
  const tag = decodeURIComponent(params.tag);

  const tagSet = await getTagSet();

  // valid한 태그 이름이 아닌 경우.
  if (!tagSet.has(tag)) {
    notFound();
  }

  const postsOnTag = await getPostsByTag(tag);

  // valid tag이더라도 실제로 그 태그를 사용하는 글이 없는 경우.
  if (postsOnTag.length === 0) {
    notFound();
  }

  return {
    title: `"${tag}" 태그`,
    description: `"${tag}" 태그에 속한 글 목록입니다.`,
  };
}
