import { Metadata } from "next";
import { notFound } from "next/navigation";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import PostList from "@/components/post-list";
import { tagSchema } from "@/schema/tags";
import { getPostsByTag, getUsedTags } from "@/service/posts";

type Props = {
  params: {
    tag: string;
  };
};

export default async function PostListInTagPage({ params }: Props) {
  const tagParamParsingResult = tagSchema.safeParse(
    decodeURIComponent(params.tag),
  );

  // valid한 태그 이름이 아닌 경우.
  if (!tagParamParsingResult.success) {
    notFound();
  }

  const { data: tag } = tagParamParsingResult;

  const posts = await getPostsByTag(tag);

  // valid tag이더라도 실제로 그 태그를 사용하는 글이 없는 경우.
  if (posts.length === 0) {
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
      <PostList posts={posts} />
    </ListSection>
  );
}

export async function generateStaticParams() {
  const tags = await getUsedTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tagParamParsingResult = tagSchema.safeParse(
    decodeURIComponent(params.tag),
  );

  // valid한 태그 이름이 아닌 경우.
  if (!tagParamParsingResult.success) {
    notFound();
  }

  const { data: tag } = tagParamParsingResult;

  const posts = await getPostsByTag(tag);

  // valid tag이더라도 실제로 그 태그를 사용하는 글이 없는 경우.
  if (posts.length === 0) {
    notFound();
  }

  return {
    title: `${tag} 태그`,
    description: `"${tag}" 태그에 속한 글 목록입니다.`,
  };
}
