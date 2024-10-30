import { Post } from "@/app/_lib/post";
import PostListItem from "./post-list-item";

type Props = {
  posts: Post[];
};

export default function PostList({ posts }: Props) {
  return (
    <ul className="divide-y divide-zinc-500 dark:divide-zinc-400">
      {posts.map((post) => (
        <PostListItem key={post.absoluteUrl} post={post} />
      ))}
    </ul>
  );
}
