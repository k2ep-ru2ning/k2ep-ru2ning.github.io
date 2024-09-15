import { Post } from "@/app/_lib/post";
import PostListItem from "./post-list-item";

type Props = {
  posts: Post[];
};

export default function PostList({ posts }: Props) {
  return (
    <ul className="divide-y divide-gray-500 dark:divide-gray-400">
      {posts.map((post) => (
        <PostListItem key={post.path} post={post} />
      ))}
    </ul>
  );
}
