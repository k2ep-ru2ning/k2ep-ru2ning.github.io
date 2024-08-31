import { getTags } from "../_lib/post";
import TagList from "../_component/tag-list";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <section className="py-3 md:py-4 flex flex-col gap-2">
      <h2 className="font-bold text-2xl">{`태그 목록`}</h2>
      <TagList tags={tags} />
    </section>
  );
}
