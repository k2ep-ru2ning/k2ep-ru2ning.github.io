import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import Link from "next/link";
import {
  rehypePrettyCode,
  type Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkHeadingId, {
  type RemarkHeadingIdOptions,
} from "remark-heading-id";
import remarkSectionize from "remark-sectionize";
import { Heading } from "@/components/ui/heading";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type Post } from "@/schema/posts";
import { PostArticleTOC } from "./toc/post-article-toc";

type Props = {
  post: Post;
};

const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  theme: {
    dark: "vitesse-dark",
    light: "vitesse-light",
  },
  defaultLang: "plaintext", // md 파일의 코드 블럭에 언어 설정을 하지 않으면 plaintext로 설정
  bypassInlineCode: true, // 인라인 코드 블럭은 pretty code가 하이라이트 하지 않음
};

const remarkHeadingIdOptions: RemarkHeadingIdOptions = {
  defaults: true, // 값을 이용해 h2, h3 등의 제목 태그 id 값을 자동으로 생성
  uniqueDefaults: true, // 값이 같더라도 다른 id 값을 생성하도록 설정
};

export async function PostArticleContent({ post }: Props) {
  const { code } = await bundleMDX({
    source: post.mdxContent,
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkGfm,
        remarkBreaks,
        [remarkHeadingId, remarkHeadingIdOptions],
        remarkSectionize,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [rehypePrettyCode, rehypePrettyCodeOptions],
      ];
      return options;
    },
  });

  const MDXComponent = getMDXComponent(code);

  return (
    <div className="lg:grid lg:grid-cols-[calc(100%-320px)_320px]">
      {/* 
        (lg 뷰포트에서) 아래 aside에 sticky를 주면 안된다.
        이 aside는 부모 요소 height를 다 차지하고 있어서,
        가장 가까운 scroll box인 뷰포트에서 스크롤이 일어나도
        sticky하게 움직일 공간이 없다. 
        그래서 TOC 컴포넌트에 sticky를 준다.
      */}
      <aside className="lg:order-1 lg:ml-5 lg:border-l lg:border-l-border">
        <PostArticleTOC headings={post.headings} />
      </aside>
      <div
        id="article-content"
        className="mt-6 lg:mt-0 max-w-full prose prose-zinc dark:prose-invert"
      >
        <MDXComponent
          components={{
            h2: ({ children, id, ...props }) => (
              <Heading {...props} as="h2" id={id} className="scroll-mt-20">
                <Link href={`#${id}`} className="no-underline">
                  {children}
                </Link>
              </Heading>
            ),
            h3: ({ children, id, ...props }) => (
              <Heading {...props} as="h3" id={id} className="scroll-mt-20">
                <Link href={`#${id}`} className="no-underline">
                  {children}
                </Link>
              </Heading>
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
    </div>
  );
}
