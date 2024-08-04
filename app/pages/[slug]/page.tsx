import { notFound } from "next/navigation";
import { getPosts } from "@/app/_lib/post";
import PostListItem from "@/app/_component/post-list-item";

type Props = {
  params: {
    slug: string;
  };
};

export default async function PostsPage({ params: { slug } }: Props) {
  if (!/^\d+$/.test(slug)) {
    notFound();
  }

  const posts = (await getPosts()).sort(
    (p1, p2) => p2.createdAt.getTime() - p1.createdAt.getTime(),
  );

  return (
    <section className="py-3 md:py-4 flex flex-col gap-2">
      <h2 className="font-bold text-2xl">{`Page ${slug}`}</h2>
      <ul className="divide-y divide-gray-500 dark:divide-gray-400">
        {posts.map((post) => (
          <PostListItem key={post.path} post={post} />
        ))}
      </ul>
    </section>
  );
}
