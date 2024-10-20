import Link from "next/link";
import { getSortedPosts } from "../_lib/post";
import PostList from "./post-list/post-list";
import ListHeading from "./list-heading";
import { LuArrowRight } from "react-icons/lu";

const RECENT_POST_LIST_SIZE = 5;

export default async function RecentPostList() {
  const posts = (await getSortedPosts()).slice(0, RECENT_POST_LIST_SIZE);

  return (
    <section className="py-3 md:py-4 flex flex-col gap-2">
      <ListHeading text="최신 글" />
      <PostList posts={posts} />
      <Link
        href="/posts/pages/1"
        className="flex items-center gap-1.5 p-1 rounded-md self-center hover:bg-zinc-200 dark:hover:bg-zinc-700"
      >
        전체 글
        <LuArrowRight className="size-5" />
      </Link>
    </section>
  );
}
