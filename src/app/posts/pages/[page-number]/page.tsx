import { type Metadata } from "next";
import { notFound } from "next/navigation";
import ListHeading from "@/components/list-heading";
import PageController from "@/components/page-controller";
import PostList from "@/components/post-list";
import { getPosts, getSortedPosts } from "@/service/post";

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
      <ListHeading>{`전체 글 목록 ${currentPageNumber}`}</ListHeading>
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

export async function generateMetadata({
  params: { "page-number": pageNumberParam },
}: Props): Promise<Metadata> {
  if (!/^\d+$/.test(pageNumberParam)) {
    notFound();
  }

  const posts = await getSortedPosts();

  const pageNumber = Number(pageNumberParam);

  const numberOfPages = Math.ceil(posts.length / PAGE_SIZE);

  if (pageNumber < 1 || pageNumber > numberOfPages) {
    notFound();
  }

  return {
    title: `전체 글 목록 ${pageNumber}`,
    description: `전체 글 목록 페이지입니다.`,
  };
}
