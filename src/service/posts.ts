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
import remarkSectionize from "remark-sectionize";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import {
  type Post,
  type PostContentHeading,
  type PostContentHeadingType,
  postMatterSchema,
} from "@/schema/posts";
import { type Tag } from "@/schema/tags";
import { getSeriesNameSet } from "./series";
import { getTagSet } from "./tags";

const POST_FILE_EXTENSION = [".md", ".mdx"];

const POSTS_DIRECTORY_PATH = path.resolve(cwd(), "src", "data", "posts");

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
  return `/posts/${absolutePath.slice(`${cwd()}/src/data/posts/`.length).replace(ext, "")}`;
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
  const validSeriesNameSet = await getSeriesNameSet();
  const validTagSet = await getTagSet();
  const posts: Post[] = [];
  try {
    const postAbsolutePaths = await getPostAbsolutePaths();
    for (const postAbsolutePath of postAbsolutePaths) {
      const file = await readFile(postAbsolutePath, { encoding: "utf8" });
      // front matter에 key만 작성한 경우, gray-matter가 명시적으로 null을 할당한다.
      const { content, data } = matter(file);
      const { createdAt, description, title, tags, series } =
        postMatterSchema.parse(data);
      if (series && !validSeriesNameSet.has(series)) {
        throw new Error(
          `글의 front matter에 존재하지 않는 series의 이름을 작성했습니다. 작성한 series 이름: "${series}"`,
        );
      }
      if (tags) {
        for (const tag of tags) {
          if (!validTagSet.has(tag)) {
            throw new Error(
              `글의 front matter에 존재하지 않는 tag를 작성했습니다. 작성한 tag: "${tag}"`,
            );
          }
        }
      }
      const { code: bundledContent } = await bundleMDX({
        source: content,
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
        series,
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

export async function getPostsByTag(tag: Tag) {
  return (await getPosts()).filter((post) => post.tags?.includes(tag));
}

export async function getPostsBySeries(seriesName: string) {
  const posts = await getPosts();
  return posts
    .filter((post) => post.series === seriesName)
    .sort((p1, p2) => p1.createdAt.getTime() - p2.createdAt.getTime());
}
