import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { getPosts } from "@/service/post";
import ListHeading from "./list-heading";
import PostList from "./post-list";

const RECENT_POST_LIST_SIZE = 5;

export default async function RecentPostList() {
  const posts = (await getPosts()).slice(0, RECENT_POST_LIST_SIZE);

  return (
    <section className="py-3 md:py-4 flex flex-col gap-2">
      <ListHeading>최신 글</ListHeading>
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
