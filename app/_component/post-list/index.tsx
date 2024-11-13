import { Fragment } from "react";
import { Post } from "@/_lib/post";
import PostListItem from "./post-list-item";
import HorizontalSeparator from "../separator/horizontal-separator";

type Props = {
  posts: Post[];
};

export default function PostList({ posts }: Props) {
  return (
    <ul>
      {posts.map((post, idx) => (
        <Fragment key={post.absoluteUrl}>
          <PostListItem post={post} />
          {idx < posts.length - 1 ? <HorizontalSeparator /> : null}
        </Fragment>
      ))}
    </ul>
  );
}
