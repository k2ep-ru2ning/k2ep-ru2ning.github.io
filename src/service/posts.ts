import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import matter from "gray-matter";

import { type Post, postMatterSchema } from "@/types/posts";
import { isValidSeriesId } from "./series";
import { isValidTag } from "./tags";

const POST_FILE_EXTENSION = [".md", ".mdx"];

const POSTS_DIRECTORY_PATH = path.resolve(cwd(), "src", "data", "posts");

const DIFF_IN_MS_BETWEEN_UTC_AND_KR = 9 * 60 * 60 * 1000;

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
