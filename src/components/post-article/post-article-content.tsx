"use client";

import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { type Post } from "@/service/posts";
import PostArticleHeading from "./mdx/post-article-heading";
import PostArticleImage from "./mdx/post-article-image";

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
          img: ({ src, alt = "" }) =>
            src ? <PostArticleImage src={src} alt={alt} /> : null,
          h2: ({ children, id }) => (
            <PostArticleHeading as="h2" id={id}>
              {children}
            </PostArticleHeading>
          ),
          h3: ({ children, id }) => (
            <PostArticleHeading as="h3" id={id}>
              {children}
            </PostArticleHeading>
          ),
        }}
      />
    </div>
  );
}
