import remarkHeadings, {
  type Heading as RemarkHeading,
} from "@vcarl/remark-headings";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import {
  rehypePrettyCode,
  type Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkHeadingId, {
  type RemarkHeadingIdOptions,
} from "remark-heading-id";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

export type HeadingType = "h2" | "h3";

export type Heading = {
  type: HeadingType;
  text: string;
  id: string;
};

const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  theme: {
    dark: "vitesse-dark",
    light: "vitesse-light",
  },
};

const remarkHeadingIdOptions: RemarkHeadingIdOptions = {
  defaults: true, // 값을 이용해 헤더의 id 값을 자동으로 생성
  uniqueDefaults: true, // 값이 같더라도 다른 id 값을 생성하도록 설정
};

export async function generateComponentFromMDXString(sourceMDXString: string) {
  const { code } = await bundleMDX({
    source: sourceMDXString,
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkGfm,
        remarkBreaks,
        [remarkHeadingId, remarkHeadingIdOptions],
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [rehypePrettyCode, rehypePrettyCodeOptions],
      ];
      return options;
    },
  });
  return getMDXComponent(code);
}

function convertDepthToHeadingType(depth: number): HeadingType {
  switch (depth) {
    case 2:
      return "h2";
    case 3:
      return "h3";
    default: {
      throw new Error(
        "mdx의 제목의 depth는 2, 3만 가능합니다. (h2, h3만 허용합니다.)",
      );
    }
  }
}

export async function extractHeadingsFromMDXString(sourceMDXString: string) {
  const processor = unified()
    .use(remarkParse) // markdown -> syntax tree(mdast)
    .use(remarkStringify) // syntax tree(mdast) -> markdown
    .use(remarkHeadingId, remarkHeadingIdOptions) // markdown의 헤더(#, ##, ### ...)에 id attribute 주입(옵션을 이용해 값을 이용해 자동 설정)
    .use(remarkHeadings); // markdown의 헤더(#, ##, ###) 데이터만 추출

  const headings: Heading[] = [];

  const headingsByRemarkHeadings = (await processor.process(sourceMDXString))
    .data.headings as RemarkHeading[];

  for (const headingByRemarkHeading of headingsByRemarkHeadings) {
    const id = headingByRemarkHeading.data?.id;
    if (!id || typeof id !== "string") {
      throw new Error("mdx의 제목에 id 속성이 필요합니다.");
    }

    const { depth, value } = headingByRemarkHeading;

    headings.push({ id, text: value, type: convertDepthToHeadingType(depth) });
  }

  return headings;
}
