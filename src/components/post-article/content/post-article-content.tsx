"use client";

import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
          table: (props) => (
            <ScrollArea>
              <table {...props} />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ),
          code: (props) => {
            if (props["data-language"]) {
              // rehype-pretty-code가 적용된 코드 블럭
              return (
                <ScrollArea>
                  <code {...props} />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              );
            }
            // 일반 inline 코드
            return <code {...props} />;
          },
        }}
      />
    </div>
  );
}
