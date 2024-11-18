import { Metadata } from "next";
import ListHeading from "@/components/list-heading";
import TagList from "@/components/tag-list";
import { getTags } from "@/service/post";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <section className="py-3 md:py-4 flex flex-col gap-6">
      <ListHeading text="태그 목록" />
      <TagList tags={tags} />
    </section>
  );
}

export const metadata: Metadata = {
  title: "태그 목록",
  description: "태그 목록 페이지",
};
