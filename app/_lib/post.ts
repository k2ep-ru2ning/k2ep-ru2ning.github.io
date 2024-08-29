import path from "path";
import matter from "gray-matter";
import { glob } from "glob";
import { readFile } from "fs/promises";
import { cwd } from "process";

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

const POSTS_DIRECTORY_PATH = path.resolve(cwd(), "posts");

const DIFF_IN_MS_BETWEEN_UTC_AND_KR = 9 * 60 * 60 * 1000;

async function getPostPaths() {
  return glob(`${POSTS_DIRECTORY_PATH}/**/*.md`);
}

// ToDo: 추후 Dummy Data 제거
function generateDummyPosts() {
  const posts: Post[] = [];
  for (let i = 0; i < 12; i++) {
    posts.push({
      content: `## Dummy Post ${i + 1}`,
      createdAt: new Date(2022, 6, i + 1),
      description: `This is Dummy Post ${i + 1}`,
      path: `/posts/dummy/dummy-post-${i + 1}`,
      title: `Dummy Post ${i + 1}`,
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
        tags: tags?.map((tag) => tag.toLowerCase()),
        path: postPath.slice(cwd().length).replace(".md", ""),
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
