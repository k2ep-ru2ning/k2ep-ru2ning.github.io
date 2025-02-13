"use client";

import "@/styles/prose.css";
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
          table: ({ children }) => (
            // table 태그의 display가 table인데, 이걸 block으로 바꾸고 scrollable하게 만드는 것보다는,
            // scrollable 하게 만들기 위해 div를 한 번더 감싸는 방법을 사용.
            <div className="max-w-full overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
        }}
      />
    </div>
  );
}
