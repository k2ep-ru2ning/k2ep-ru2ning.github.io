import rehypeExtractToc, { type Toc } from "@stefanprobst/rehype-extract-toc";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import Link from "next/link";
import {
  rehypePrettyCode,
  type Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkSectionize from "remark-sectionize";
import { unified } from "unified";
import { Heading } from "@/components/ui/heading";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type PostContentHeading, type Post } from "@/types/posts";
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

async function extractHeadingsFromMDX(mdxSource: string) {
  const file = await unified()
    .use(remarkParse) // markdown -> syntax tree(mdast)
    .use(remarkRehype) // syntax tree(mdast) -> syntax tree(hast)
    .use(rehypeSlug) // 제목 태그에 id 속성이 없다면, 내용 기반으로 id 속성 생성
    .use(rehypeExtractToc) // 제목 태그 추출
    .use(rehypeStringify) // syntax tree(hast) -> html 문자열 출력
    .process(mdxSource);

  const { toc = [] } = file.data;

  const headings: PostContentHeading[] = [];

  function processToc(toc: Toc) {
    for (const { depth, value, children, id } of toc) {
      if (id === undefined) {
        throw new Error(
          "제목에 id 속성이 없습니다. rehype-slug가 제대로 적용되었는지 확인해주세요.",
        );
      }
      if (depth !== 2 && depth !== 3) {
        throw new Error("글 본문에는 h2, h3만 허용됩니다.");
      }
      headings.push({ id, text: value, type: `h${depth}` });
      if (children) {
        processToc(children);
      }
    }
  }

  processToc(toc);

  return headings;
}

export async function PostArticleContent({ post }: Props) {
  const { code } = await bundleMDX({
    source: post.mdxContent,
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkGfm,
        remarkBreaks,
        remarkSectionize,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        [rehypePrettyCode, rehypePrettyCodeOptions],
      ];
      return options;
    },
  });

  const headings = await extractHeadingsFromMDX(post.mdxContent);

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
        <PostArticleTOC headings={headings} />
      </aside>
      <div
        id="article-content"
        className="mt-6 lg:mt-0 max-w-full prose prose-zinc dark:prose-invert"
      >
        <MDXComponent
          components={{
            h2: ({ children, id, ...props }) => (
              <Heading {...props} as="h2" id={id} className="scroll-mt-20">
                <Link href={`#${id}`} className="no-underline font-bold">
                  {children}
                </Link>
              </Heading>
            ),
            h3: ({ children, id, ...props }) => (
              <Heading {...props} as="h3" id={id} className="scroll-mt-20">
                <Link href={`#${id}`} className="no-underline font-bold">
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
