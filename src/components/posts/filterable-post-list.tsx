"use client";

import { Fragment } from "react";
import usePageSearchParam from "@/hooks/use-page-search-param";
import { type Post } from "@/schema/posts";
import { type Tag } from "@/schema/tags";
import PostList from "./post-list";
import PostListItem from "./post-list-item";
import Pagination from "../pagination";
import HorizontalSeparator from "../separator/horizontal-separator";
import TagList from "../tags/tag-list";
import TagListItem from "../tags/tag-list-item";

type Props = {
  posts: Post[];
  tags: Tag[];
};

const PAGE_SIZE = 4;

export default function FilterablePostList({ posts, tags }: Props) {
  const pageNumber = parseInt(usePageSearchParam());

  // 글이 없는 경우도 페이지가 1개 존재한다고 간주.
  // 1 <= 유효한 페이지 번호 <= numberOfPages 가 성립하려면,
  // numberOfPages는 적어도 1이상이어야 한다.
  const numberOfPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

  const postsOnPage =
    pageNumber >= 1 && pageNumber <= numberOfPages
      ? posts.slice(
          (pageNumber - 1) * PAGE_SIZE, // page 내의 첫번째 post의 index
          (pageNumber - 1) * PAGE_SIZE + PAGE_SIZE,
        )
      : [];

  return (
    <>
      {tags.length === 0 ? null : (
        <TagList>
          {tags.map((tag) => (
            <TagListItem key={tag} tag={tag} link={`/posts?tag=${tag}`} />
          ))}
        </TagList>
      )}
      {postsOnPage.length === 0 ? (
        <p>
          선택한 <strong>태그</strong>와 <strong>페이지 번호</strong>에 맞는
          글이 없습니다.
        </p>
      ) : (
        <PostList>
          {postsOnPage.map((post, idx) => (
            <Fragment key={post.absoluteUrl}>
              <PostListItem post={post} />
              {idx < postsOnPage.length - 1 ? <HorizontalSeparator /> : null}
            </Fragment>
          ))}
        </PostList>
      )}
      <Pagination
        generatePageLink={(pageNumber) => `/posts?page=${pageNumber}`}
        activePageNumber={pageNumber}
        numberOfPages={numberOfPages}
      />
    </>
  );
}
