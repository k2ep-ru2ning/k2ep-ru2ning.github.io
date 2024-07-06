import Link from "next/link";
import { MoveRight } from "lucide-react";
import RecentPostListItem from "./recent-post-list-item";
import { getPosts } from "../_lib/post";

const RECENT_POST_LIST_SIZE = 5;

export default async function RecentPostList() {
  const posts = (await getPosts())
    .sort((p1, p2) => p2.createdAt.getTime() - p1.createdAt.getTime())
    .slice(0, RECENT_POST_LIST_SIZE);

  return (
    <section className="py-4 flex flex-col gap-2">
      <h2 className="text-gray-950 dark:text-gray-50 font-bold text-2xl">
        {"최신 글"}
      </h2>
      <ul className="divide-y divide-gray-950 dark:divide-gray-50">
        {posts.map((post) => (
          <RecentPostListItem key={post.slug} post={post} />
        ))}
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
