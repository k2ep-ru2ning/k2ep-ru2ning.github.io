import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import remarkHeadings, {
  type Heading as RemarkHeading,
} from "@vcarl/remark-headings";
import matter from "gray-matter";
import remarkHeadingId, {
  type RemarkHeadingIdOptions,
} from "remark-heading-id";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import {
  type Post,
  type PostContentHeading,
  type PostContentHeadingType,
  postMatterSchema,
} from "@/schema/posts";
import { isValidSeriesId } from "./series";
import { isValidTag } from "./tags";

const POST_FILE_EXTENSION = [".md", ".mdx"];

const POSTS_DIRECTORY_PATH = path.resolve(cwd(), "src", "data", "posts");

const DIFF_IN_MS_BETWEEN_UTC_AND_KR = 9 * 60 * 60 * 1000;

const remarkHeadingIdOptions: RemarkHeadingIdOptions = {
  defaults: true, // 값을 이용해 헤더의 id 값을 자동으로 생성
  uniqueDefaults: true, // 값이 같더라도 다른 id 값을 생성하도록 설정
};

/**
 * 글 파일 경로에서 앞쪽의 POSTS_DIRECTORY_PATH와 뒤쪽의 확장자를 제거한 경로를 id로 활용.
 * 예시 형태: 2025/dijkstra-algorithm
 */
function generatePostIdFromPostAbsolutePath(absolutePath: string) {
  const ext = path.extname(absolutePath);
  return absolutePath.slice(`${POSTS_DIRECTORY_PATH}/`.length).replace(ext, "");
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
      // front matter에 key만 작성한 경우, gray-matter가 명시적으로 null을 할당한다.
      const { content, data } = matter(file);
      const { createdAt, description, title, tags, seriesId } =
        postMatterSchema.parse(data);
      if (seriesId && !isValidSeriesId(seriesId)) {
        throw new Error(
          `글의 front matter에 존재하지 않는 series의 이름을 작성했습니다. 작성한 series 이름: "${seriesId}"`,
        );
      }
      if (tags) {
        for (const tag of tags) {
          if (!isValidTag(tag)) {
            throw new Error(
              `글의 front matter에 존재하지 않는 tag를 작성했습니다. 작성한 tag: "${tag}"`,
            );
          }
        }
      }
      const headings = await extractHeadingsFromMDXString(content);
      posts.push({
        mdxContent: content,
        createdAt: new Date(
          createdAt.getTime() - DIFF_IN_MS_BETWEEN_UTC_AND_KR,
        ),
        description,
        title,
        tags: tags?.toSorted((tag1, tag2) => tag1.localeCompare(tag2)),
        seriesId,
        id: generatePostIdFromPostAbsolutePath(postAbsolutePath),
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

export async function getPostById(id: string) {
  const posts = await getPosts();
  return posts.find((post) => post.id === id);
}

export async function getPostsBySeries(seriesId: string) {
  const posts = await getPosts();
  return posts
    .filter((post) => post.seriesId === seriesId)
    .sort((p1, p2) => p1.createdAt.getTime() - p2.createdAt.getTime());
}
