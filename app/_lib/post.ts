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
  path: string;
  content: string;
};

const POST_FILE_EXTENSION = ".mdx";

const POSTS_DIRECTORY_PATH = path.resolve(cwd(), "posts", "contents");

const DIFF_IN_MS_BETWEEN_UTC_AND_KR = 9 * 60 * 60 * 1000;

async function getPostPaths() {
  return glob(`${POSTS_DIRECTORY_PATH}/**/*${POST_FILE_EXTENSION}`);
}

// ToDo: 추후 Dummy Data 제거
function generateDummyPosts() {
  const posts: Post[] = [];
  for (let i = 0; i < 27; i++) {
    const id = String.fromCharCode("A".charCodeAt(0) + i);
    posts.push({
      content: `## Dummy Post ${id}`,
      createdAt: new Date(2022, 6, i + 1),
      description: `This is Dummy Post ${id}`,
      path: `/posts/contents/dummy/dummy-post-${id}`,
      title: `Dummy Post ${id}`,
      tags: [`더미-태그-${id}`, "더미-태그"].sort((tag1, tag2) =>
        tag1.localeCompare(tag2),
      ),
    });
  }
  return posts;
}

export async function getPosts() {
  const posts: Post[] = [];
  try {
    const postPaths = await getPostPaths();
    for (const postPath of postPaths) {
      const file = await readFile(postPath, { encoding: "utf8" });
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
        path: postPath.slice(cwd().length).replace(POST_FILE_EXTENSION, ""),
      });
    }
  } catch (e) {
    throw new Error("post 파일을 read, parse 하는데 문제가 발생했습니다.");
  }
  // ToDo: 추후 Dummy Data 제거
  return [...posts, ...generateDummyPosts()];
}

export async function getSortedPosts() {
  return (await getPosts()).sort(
    (p1, p2) => p2.createdAt.getTime() - p1.createdAt.getTime(),
  );
}

export async function getPostByPath(path: string) {
  const posts = await getPosts();
  return posts.find((post) => post.path === path);
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
