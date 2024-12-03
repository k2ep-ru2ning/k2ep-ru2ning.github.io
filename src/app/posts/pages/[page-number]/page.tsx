import { type Metadata } from "next";
import { notFound } from "next/navigation";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import PageController from "@/components/page-controller";
import PostList from "@/components/post-list";
import { getPosts } from "@/service/posts";

type Props = {
  params: {
    "page-number": string;
  };
};

const PAGE_SIZE = 4;

export default async function PostListPage({
  params: { "page-number": pageNumber },
}: Props) {
  if (!/^\d+$/.test(pageNumber)) {
    notFound();
  }

  const posts = await getPosts();

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
    <ListSection>
      <ListHeading>{`글 목록 ${currentPageNumber}`}</ListHeading>
      <PostList posts={postsOfCurrentPage} />
      <PageController
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

export async function generateMetadata({
  params: { "page-number": pageNumberParam },
}: Props): Promise<Metadata> {
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
