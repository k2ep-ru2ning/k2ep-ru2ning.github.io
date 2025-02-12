import { Fragment } from "react";
import { type Post } from "@/schema/posts";
import PostListItem from "./post-list-item";
import HorizontalSeparator from "../separator/horizontal-separator";

type Props = {
  posts: Post[];
};

export default function PostList({ posts }: Props) {
  if (posts.length === 0) {
    return <p>글이 존재하지 않습니다.</p>;
  }

  return (
    <ul className="flex flex-col gap-8">
      {posts.map((post, idx) => (
        <Fragment key={post.absoluteUrl}>
          <PostListItem post={post} />
          {idx < posts.length - 1 ? <HorizontalSeparator /> : null}
        </Fragment>
      ))}
    </ul>
  );
}
