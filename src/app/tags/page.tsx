import { Metadata } from "next";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import TagList from "@/components/tag-list";
import { getUsedTags } from "@/service/posts";

export default async function TagsPage() {
  const tags = await getUsedTags();

  return (
    <ListSection>
      <ListHeading>태그 목록</ListHeading>
      <TagList tags={tags} />
    </ListSection>
  );
}

export const metadata: Metadata = {
  title: "태그 목록",
  description: "태그 목록 페이지입니다.",
};
