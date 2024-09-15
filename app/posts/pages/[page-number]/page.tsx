import { notFound } from "next/navigation";
import { getPosts, getSortedPosts } from "@/app/_lib/post";
import PageController from "@/app/_component/page-controller/page-controller";
import PostList from "@/app/_component/post-list/post-list";

type Props = {
  params: {
    "page-number": string;
  };
};

const PAGE_SIZE = 5;

export default async function PostListPage({
  params: { "page-number": pageNumber },
}: Props) {
  if (!/^\d+$/.test(pageNumber)) {
    notFound();
  }

  const posts = await getSortedPosts();

  const currentPageNumber = Number(pageNumber);

  const numberOfPages = Math.ceil(posts.length / PAGE_SIZE);

  if (currentPageNumber < 1 || currentPageNumber > numberOfPages) {
    notFound();
  }

  const firstPostIndexOfCurrentPage = (currentPageNumber - 1) * PAGE_SIZE;

  const postsOfCurrentPage = posts.slice(
    firstPostIndexOfCurrentPage,
    firstPostIndexOfCurrentPage + PAGE_SIZE,
  );

  return (
    <section className="py-3 md:py-4 flex flex-col gap-2">
      <h2 className="font-bold text-2xl">{`전체 글 목록 ${currentPageNumber}`}</h2>
      <PostList posts={postsOfCurrentPage} />
      <PageController
        basePath="/posts/pages"
        currentPageNumber={currentPageNumber}
        numberOfPages={numberOfPages}
      />
    </section>
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  const numberOfPages = Math.ceil(posts.length / PAGE_SIZE);
  return Array.from({ length: numberOfPages }, (_, idx) => ({
    "page-number": String(idx + 1),
  }));
}
