import { type Metadata } from "next";
import { notFound } from "next/navigation";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import Pagination from "@/components/pagination";
import PostList from "@/components/post-list";
import { getPosts } from "@/service/posts";

type Props = {
  params: Promise<{
    "page-number": string;
  }>;
};

const PAGE_SIZE = 4;

export default async function PostListPage({ params }: Props) {
  const { "page-number": pageNumberParam } = await params;

  if (!/^\d+$/.test(pageNumberParam)) {
    notFound();
  }

  const posts = await getPosts();

  const currentPageNumber = Number(pageNumberParam);

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
    <ListSection>
      <ListHeading>{`글 목록 ${currentPageNumber}`}</ListHeading>
      <PostList posts={postsOfCurrentPage} />
      <Pagination
        basePath="/posts/pages"
        currentPageNumber={currentPageNumber}
        numberOfPages={numberOfPages}
      />
    </ListSection>
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  const numberOfPages = Math.ceil(posts.length / PAGE_SIZE);
  return Array.from({ length: numberOfPages }, (_, idx) => ({
    "page-number": String(idx + 1),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "page-number": pageNumberParam } = await params;

  if (!/^\d+$/.test(pageNumberParam)) {
    notFound();
  }

  const posts = await getPosts();

  const pageNumber = Number(pageNumberParam);

  const numberOfPages = Math.ceil(posts.length / PAGE_SIZE);

  if (pageNumber < 1 || pageNumber > numberOfPages) {
    notFound();
  }

  return {
    title: `글 목록 ${pageNumber}`,
    description: `전체 글 목록 페이지입니다.`,
  };
}
