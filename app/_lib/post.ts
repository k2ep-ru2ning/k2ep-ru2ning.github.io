import path from "node:path";
import matter from "gray-matter";
import { glob } from "glob";
import { readFile } from "node:fs/promises";
import { cwd } from "node:process";

type PostMatter = {
  title: string;
  description: string;
  createdAt: Date;
  tags?: string[];
};

export type Post = PostMatter & {
  absoluteUrl: string;
  content: string;
};

const POST_FILE_EXTENSION = ".mdx";

const POSTS_DIRECTORY_PATH = path.resolve(cwd(), "posts");

const DIFF_IN_MS_BETWEEN_UTC_AND_KR = 9 * 60 * 60 * 1000;

function convertPostAbsolutePathToAbsoluteUrl(path: string) {
  return `/posts/contents/${path.slice(`${cwd()}/posts/`.length).replace(POST_FILE_EXTENSION, "")}`;
}

async function getPostAbsolutePaths() {
  return glob(`${POSTS_DIRECTORY_PATH}/**/*${POST_FILE_EXTENSION}`);
}

export async function getPosts() {
  const posts: Post[] = [];
  try {
    const postAbsolutePaths = await getPostAbsolutePaths();
    for (const postAbsolutePath of postAbsolutePaths) {
      const file = await readFile(postAbsolutePath, { encoding: "utf8" });
      const { content, data } = matter(file);
      const { createdAt, description, title, tags } = data as PostMatter;
      posts.push({
        content,
        createdAt: new Date(
          createdAt.getTime() - DIFF_IN_MS_BETWEEN_UTC_AND_KR,
        ),
        description,
        title,
        tags: tags
          ?.map((tag) => tag.toLowerCase())
          .sort((tag1, tag2) => tag1.localeCompare(tag2)),
        absoluteUrl: convertPostAbsolutePathToAbsoluteUrl(postAbsolutePath),
      });
    }
  } catch (e) {
    console.error(e);
    throw new Error("post 파일을 read, parse 하는데 문제가 발생했습니다.");
  }
  return posts;
}

export async function getSortedPosts() {
  return (await getPosts()).sort(
    (p1, p2) => p2.createdAt.getTime() - p1.createdAt.getTime(),
  );
}

export async function getPostByAbsoluteUrl(url: string) {
  const posts = await getPosts();
  return posts.find((post) => post.absoluteUrl === url);
}

export async function getTags() {
  const posts = await getPosts();
  return [...new Set(posts.flatMap((post) => post.tags ?? []))].sort(
    (tag1, tag2) => tag1.localeCompare(tag2),
  );
}

export async function getSortedPostsByTag(tag: string) {
  return (await getSortedPosts()).filter((post) => post.tags?.includes(tag));
}
