import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import matter from "gray-matter";
import { z } from "zod";

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
  content: string;
};

const POST_FILE_EXTENSION = ".mdx";

const POSTS_DIRECTORY_PATH = path.resolve(cwd(), "src", "posts");

const DIFF_IN_MS_BETWEEN_UTC_AND_KR = 9 * 60 * 60 * 1000;

function convertPostAbsolutePathToAbsoluteUrl(path: string) {
  return `/posts/contents/${path.slice(`${cwd()}/src/posts/`.length).replace(POST_FILE_EXTENSION, "")}`;
}

async function getPostAbsolutePaths() {
  // POSTS_DIRECTORY_PATH 경로의 디렉토리의 내용을 모두 읽어들인다.
  // 내부의 디렉터리, 파일 모두 읽어 들인다. (재귀적으로)
  const dirContents = await readdir(POSTS_DIRECTORY_PATH, { recursive: true });

  // 읽어들인 디렉터리, 파일 중, .mdx 확장자의 파일만 filtering 한다.
  const postRelativePaths = dirContents.filter(
    (content) => path.extname(content) === POST_FILE_EXTENSION,
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
      const { content, data } = matter(file);
      const { createdAt, description, title, tags } =
        postMatterSchema.parse(data);
      posts.push({
        content,
        createdAt: new Date(
          createdAt.getTime() - DIFF_IN_MS_BETWEEN_UTC_AND_KR,
        ),
        description,
        title,
        tags: tags?.toSorted((tag1, tag2) => tag1.localeCompare(tag2)),
        absoluteUrl: convertPostAbsolutePathToAbsoluteUrl(postAbsolutePath),
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
