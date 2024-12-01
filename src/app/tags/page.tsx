import { Metadata } from "next";
import ListHeading from "@/components/list-heading";
import TagList from "@/components/tag-list";
import { getUsedTags } from "@/service/posts";

export default async function TagsPage() {
  const tags = await getUsedTags();

  return (
    <section className="py-3 md:py-4 flex flex-col gap-6">
      <ListHeading>태그 목록</ListHeading>
      <TagList tags={tags} />
    </section>
  );
}

export const metadata: Metadata = {
  title: "태그 목록",
  description: "태그 목록 페이지입니다.",
};
