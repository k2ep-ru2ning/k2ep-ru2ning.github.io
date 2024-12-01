import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import remarkHeadings, {
  type Heading as RemarkHeading,
} from "@vcarl/remark-headings";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
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
import { z } from "zod";

export type PostContentHeadingType = "h2" | "h3";

export type PostContentHeading = {
  type: PostContentHeadingType;
  text: string;
  id: string;
};

const VALID_TAGS = [
  "회고",
  "개발 환경 설정",
  "React",
  "Babel",
  "Webpack",
  "Vite",
] as const;

export const tagSchema = z.enum(VALID_TAGS);

export type Tag = z.infer<typeof tagSchema>;

const postMatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  tags: tagSchema.array().nullable().optional(),
});

type PostMatter = z.infer<typeof postMatterSchema>;

export type Post = PostMatter & {
  absoluteUrl: string;
  rawContent: string; // 읽어들인 .md, .mdx 파일 내용
  bundledContent: string; // mdx-bundler에 의해 처리된 파일 내용
  headings: PostContentHeading[];
};

const POST_FILE_EXTENSION = [".md", ".mdx"];

const POSTS_DIRECTORY_PATH = path.resolve(cwd(), "src", "posts");

const DIFF_IN_MS_BETWEEN_UTC_AND_KR = 9 * 60 * 60 * 1000;

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

function convertPostAbsolutePathToAbsoluteUrl(absolutePath: string) {
  const ext = path.extname(absolutePath);
  return `/posts/contents/${absolutePath.slice(`${cwd()}/src/posts/`.length).replace(ext, "")}`;
}

async function getPostAbsolutePaths() {
  // POSTS_DIRECTORY_PATH 경로의 디렉토리의 내용을 모두 읽어들인다.
  // 내부의 디렉터리, 파일 모두 읽어 들인다. (재귀적으로)
  const dirContents = await readdir(POSTS_DIRECTORY_PATH, { recursive: true });

  // 읽어들인 디렉터리, 파일 중, .md, .mdx 확장자의 파일만 filtering 한다.
  const postRelativePaths = dirContents.filter((content) =>
    POST_FILE_EXTENSION.includes(path.extname(content)),
  );

  // 절대 경로로 변환한다.
  return postRelativePaths.map(
    (relativePath) => `${POSTS_DIRECTORY_PATH}/${relativePath}`,
  );
}

function convertDepthToHeadingType(depth: number): PostContentHeadingType {
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

async function extractHeadingsFromMDXString(sourceMDXString: string) {
  const processor = unified()
    .use(remarkParse) // markdown -> syntax tree(mdast)
    .use(remarkStringify) // syntax tree(mdast) -> markdown
    .use(remarkHeadingId, remarkHeadingIdOptions) // markdown의 헤더(#, ##, ### ...)에 id attribute 주입(옵션을 이용해 값을 이용해 자동 설정)
    .use(remarkHeadings); // markdown의 헤더(#, ##, ###) 데이터만 추출

  const headings: PostContentHeading[] = [];

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

export async function getPosts() {
  const posts: Post[] = [];
  try {
    const postAbsolutePaths = await getPostAbsolutePaths();
    for (const postAbsolutePath of postAbsolutePaths) {
      const file = await readFile(postAbsolutePath, { encoding: "utf8" });
      const { content, data } = matter(file);
      const { createdAt, description, title, tags } =
        postMatterSchema.parse(data);
      const { code: bundledContent } = await bundleMDX({
        source: content,
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
      const headings = await extractHeadingsFromMDXString(content);
      posts.push({
        rawContent: content,
        bundledContent,
        createdAt: new Date(
          createdAt.getTime() - DIFF_IN_MS_BETWEEN_UTC_AND_KR,
        ),
        description,
        title,
        tags: tags?.toSorted((tag1, tag2) => tag1.localeCompare(tag2)),
        absoluteUrl: convertPostAbsolutePathToAbsoluteUrl(postAbsolutePath),
        headings,
      });
    }
  } catch (e) {
    throw new Error("post 파일을 read, parse 하는데 문제가 발생했습니다.", {
      cause: e,
    });
  }
  return posts.sort(
    (p1, p2) => p2.createdAt.getTime() - p1.createdAt.getTime(),
  );
}

export async function getPostByAbsoluteUrl(url: string) {
  const posts = await getPosts();
  return posts.find((post) => post.absoluteUrl === url);
}

// valid tag들이 아닌, valid tag들 중 실제로 post에서 사용 중인 tag들을 조회
export async function getUsedTags() {
  const posts = await getPosts();
  return [...new Set(posts.flatMap((post) => post.tags ?? []))].sort(
    (tag1, tag2) => tag1.localeCompare(tag2),
  );
}

export async function getPostsByTag(tag: Tag) {
  return (await getPosts()).filter((post) => post.tags?.includes(tag));
}
