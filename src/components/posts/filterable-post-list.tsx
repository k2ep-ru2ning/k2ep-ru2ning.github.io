"use client";

import Link from "next/link";
import { Fragment } from "react";
import { LuRefreshCw } from "react-icons/lu";
import useCreateQueryString from "@/hooks/use-create-query-string";
import usePageQueryString from "@/hooks/use-page-query-string";
import useTagQueryString from "@/hooks/use-tag-query-string";
import { type Post } from "@/schema/posts";
import { type Tag } from "@/schema/tags";
import cn from "@/utils/cn";
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
  const createQueryString = useCreateQueryString();

  const tagQueryString = useTagQueryString();

  const pageQueryString = usePageQueryString();

  if (tagQueryString.result === "invalid" || !pageQueryString.isValid) {
    return (
      <div className="flex flex-col gap-y-3">
        <p>
          선택한 <strong>태그</strong> 또는 <strong>페이지 번호</strong>가
          잘못되었습니다.
        </p>
        <Link
          href="/posts"
          replace
          className="flex items-center gap-1.5 p-1 rounded-md self-start hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          초기화
          <LuRefreshCw className="size-5" />
        </Link>
      </div>
    );
  }

  const pageNumber = parseInt(pageQueryString.value);

  const filteredPostsByTag =
    tagQueryString.result === "selectTag"
      ? posts.filter((post) => post.tags?.includes(tagQueryString.value))
      : posts;

  // 글이 없는 경우도 페이지가 1개 존재한다고 간주.
  // 1 <= 유효한 페이지 번호 <= numberOfPages 가 성립하려면,
  // numberOfPages는 적어도 1이상이어야 한다.
  const numberOfPages = Math.max(
    1,
    Math.ceil(filteredPostsByTag.length / PAGE_SIZE),
  );

  const filteredPostsByTagOnPage =
    pageNumber >= 1 && pageNumber <= numberOfPages
      ? filteredPostsByTag.slice(
          (pageNumber - 1) * PAGE_SIZE, // page 내의 첫번째 post의 index
          (pageNumber - 1) * PAGE_SIZE + PAGE_SIZE,
        )
      : [];

  return (
    <>
      {tags.length === 0 ? null : (
        <TagList>
          <TagListItem
            tag="전체"
            link="/posts"
            className={cn(
              tagQueryString.result === "selectAll" &&
                "text-indigo-500 font-bold",
            )}
          />
          {tags.map((tag) => (
            <TagListItem
              key={tag}
              tag={tag}
              link={`/posts?tag=${tag}`}
              className={cn(
                tagQueryString.result === "selectTag" &&
                  tagQueryString.value === tag &&
                  "text-indigo-500 font-bold",
              )}
            />
          ))}
        </TagList>
      )}
      {filteredPostsByTagOnPage.length === 0 ? (
        <p>
          선택한 <strong>태그</strong>와 <strong>페이지 번호</strong>에 맞는
          글이 없습니다.
        </p>
      ) : (
        <PostList>
          <HorizontalSeparator />
          {filteredPostsByTagOnPage.map((post) => (
            <Fragment key={post.absoluteUrl}>
              <PostListItem post={post} />
              <HorizontalSeparator />
            </Fragment>
          ))}
        </PostList>
      )}
      <Pagination
        generatePageLink={(pageNumber) =>
          "/posts?" + createQueryString("page", String(pageNumber))
        }
        activePageNumber={pageNumber}
        numberOfPages={numberOfPages}
      />
    </>
  );
}
