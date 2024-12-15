"use client";

import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { type Post } from "@/schema/posts";
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
      className="max-w-full prose sm:prose-lg prose-zinc dark:prose-invert"
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
