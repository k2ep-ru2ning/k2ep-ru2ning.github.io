import { type Post } from "../_lib/post";

type Props = {
  post: Post;
};

export default function RecentPostListItem({
  post: { title, description, createdAt },
}: Props) {
  return (
    <li className="py-4 flex gap-8 text-gray-950 dark:text-gray-50">
      <time className="shrink-0 text-sm">{createdAt.toLocaleString()}</time>
      <section className="grow overflow-hidden flex flex-col gap-3">
        <h3 className="font-bold text-xl truncate">{title}</h3>
        <p className="truncate">{description}</p>
      </section>
    </li>
  );
}
