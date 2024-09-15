import Link from "next/link";
import { MoveRight } from "lucide-react";
import { getSortedPosts } from "../_lib/post";
import PostList from "./post-list/post-list";

const RECENT_POST_LIST_SIZE = 5;

export default async function RecentPostList() {
  const posts = (await getSortedPosts()).slice(0, RECENT_POST_LIST_SIZE);

  return (
    <section className="py-3 md:py-4 flex flex-col gap-2">
      <h2 className="font-bold text-2xl">{"최신 글"}</h2>
      <PostList posts={posts} />
      <Link
        href="/posts/pages/1"
        className="flex items-center gap-1.5 p-1 rounded-md self-center hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {"전체 글"}
        <MoveRight size={20} />
      </Link>
    </section>
  );
}
