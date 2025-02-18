import { Metadata } from "next";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import TagList from "@/components/tags/tag-list";
import TagListItem from "@/components/tags/tag-list-item";
import { getTags } from "@/service/tags";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <ListSection>
      <ListHeading>태그 목록</ListHeading>
      {tags.length > 0 ? (
        <TagList>
          {tags.map((tag) => (
            <TagListItem key={tag} tag={tag} link={`/posts?tag=${tag}`} />
          ))}
        </TagList>
      ) : null}
    </ListSection>
  );
}

export const metadata: Metadata = {
  title: "태그 목록",
  description: "태그 목록 페이지입니다.",
};
