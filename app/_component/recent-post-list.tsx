import Link from "next/link";
import RecentPostListItem from "./recent-post-list-item";
import { MoveRight } from "lucide-react";

export default function RecentPostList() {
  return (
    <section className="py-4 flex flex-col gap-2">
      <h2 className="text-gray-950 dark:text-gray-50 font-bold text-2xl">
        {"최신 글"}
      </h2>
      <ul className="divide-y divide-gray-950 dark:divide-gray-50">
        <RecentPostListItem />
        <RecentPostListItem />
        <RecentPostListItem />
        <RecentPostListItem />
        <RecentPostListItem />
      </ul>
      <Link
        href="/posts"
        className="flex items-center gap-1.5 p-1 rounded-md self-center hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-950 dark:text-gray-50"
      >
        {"전체 글"}
        <MoveRight size={20} />
      </Link>
    </section>
  );
}
