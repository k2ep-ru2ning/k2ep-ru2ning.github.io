"use client";

import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { type Post } from "@/service/posts";
import PostArticleContentHeading from "./post-article-content-heading";

type Props = {
  post: Post;
};

export default function PostArticleContent({ post }: Props) {
  const MDXComponent = useMemo(
    () => getMDXComponent(post.bundledContent),
    [post.bundledContent],
  );

  return (
    <div
      id="article-content"
      className="max-w-full prose prose-zinc dark:prose-invert prose-sm sm:prose-base"
    >
      <MDXComponent
        components={{
          h2: ({ children, id }) => (
            <PostArticleContentHeading as="h2" id={id}>
              {children}
            </PostArticleContentHeading>
          ),
          h3: ({ children, id }) => (
            <PostArticleContentHeading as="h3" id={id}>
              {children}
            </PostArticleContentHeading>
          ),
        }}
      />
    </div>
  );
}
