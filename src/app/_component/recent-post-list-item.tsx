export default function RecentPostListItem() {
  return (
    <li className="py-4 flex gap-8 text-gray-950 dark:text-gray-50">
      <time className="shrink-0 text-sm">{"2024-06-27"}</time>
      <section className="grow overflow-hidden flex flex-col gap-3">
        <h3 className="font-bold text-xl truncate">
          {
            "title title title title title title title title title title title title title title title title title title title title title title title"
          }
        </h3>
        <p className="truncate">
          {
            "subtext subtext subtext subtext subtext subtext subtext subtext subtext subtext subtext subtext subtext subtext"
          }
        </p>
      </section>
    </li>
  );
}
