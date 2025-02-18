"use client";

import { useSearchParams } from "next/navigation";
import { Fragment } from "react";
import { type Post } from "@/schema/posts";
import PostListItem from "./post-list-item";
import Pagination from "../pagination";
import HorizontalSeparator from "../separator/horizontal-separator";

type Props = {
  posts: Post[];
};

const PAGE_SIZE = 4;

export default function PostList({ posts }: Props) {
  const searchParams = useSearchParams();

  const pageSearchParam = searchParams.get("page") ?? "1";

  if (!/^\d+$/.test(pageSearchParam)) {
    return <p>글이 존재하지 않습니다.</p>;
  }

  const currentPageNumber = Number(pageSearchParam);

  // 글이 없는 경우도 페이지가 1개 존재한다고 간주.
  const numberOfPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

  if (currentPageNumber < 1 || currentPageNumber > numberOfPages) {
    return <p>글이 존재하지 않습니다.</p>;
  }

  const firstPostIndexOfCurrentPage = (currentPageNumber - 1) * PAGE_SIZE;

  const postsOfCurrentPage = posts.slice(
    firstPostIndexOfCurrentPage,
    firstPostIndexOfCurrentPage + PAGE_SIZE,
  );

  return (
    <>
      {postsOfCurrentPage.length === 0 ? (
        <p>글이 존재하지 않습니다.</p>
      ) : (
        <ul className="flex flex-col gap-8">
          {postsOfCurrentPage.map((post, idx) => (
            <Fragment key={post.absoluteUrl}>
              <PostListItem post={post} />
              {idx < postsOfCurrentPage.length - 1 ? (
                <HorizontalSeparator />
              ) : null}
            </Fragment>
          ))}
        </ul>
      )}
      <Pagination
        generatePageLink={(pageNumber) => `/posts?page=${pageNumber}`}
        activePageNumber={currentPageNumber}
        numberOfPages={numberOfPages}
      />
    </>
  );
}
