import { Fragment } from "react";
import { type Post } from "@/service/posts";
import PostListItem from "./post-list-item";
import HorizontalSeparator from "../separator/horizontal-separator";

type Props = {
  posts: Post[];
};

export default function PostList({ posts }: Props) {
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
