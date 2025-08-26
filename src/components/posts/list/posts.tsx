"use client";

import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { paths } from "@/config/paths";
import { useCreateQueryString } from "@/hooks/use-create-query-string";
import { usePageQueryString } from "@/hooks/use-page-query-string";
import { useTagQueryString } from "@/hooks/use-tag-query-string";
import { type Post } from "@/schema/posts";
import { type Tag } from "@/schema/tags";
import { PostItem } from "./post-item";
import { PostsPagination } from "./posts-pagination";
import { TagLink } from "../../tags/tag-link";
import { TagList } from "../../tags/tag-list";
import { Button } from "../../ui/button";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";

type Props = {
  posts: Post[];
  tags: Tag[];
};

const PAGE_SIZE = 6;

export function Posts({ posts, tags }: Props) {
  const createQueryString = useCreateQueryString();

  const tagQueryString = useTagQueryString();

  const pageQueryString = usePageQueryString();

  if (tagQueryString.result === "invalid" || !pageQueryString.isValid) {
    return (
      <div className="flex flex-col gap-y-3">
        <p>
          선택한 <em className="not-italic font-bold">태그</em> 또는{" "}
          <em className="not-italic font-bold">페이지 번호</em>가
          잘못되었습니다.
        </p>
        <Button asChild variant="ghost" className="self-start">
          <Link href={paths.posts.getHref()} replace>
            초기화
            <RefreshCw className="size-5" />
          </Link>
        </Button>
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
        <ScrollArea>
          <TagList className="flex-nowrap pb-3">
            <li className="shrink-0">
              <TagLink
                tag="전체"
                isActive={tagQueryString.result === "selectAll"}
              />
            </li>
            {tags.map((tag) => (
              <li key={tag} className="shrink-0">
                <TagLink
                  tag={tag}
                  isActive={
                    tagQueryString.result === "selectTag" &&
                    tagQueryString.value === tag
                  }
                />
              </li>
            ))}
          </TagList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
      {filteredPostsByTagOnPage.length === 0 ? (
        <p>
          선택한 <em className="not-italic font-bold">태그</em>와{" "}
          <em className="not-italic font-bold">페이지 번호</em>에 맞는 글이
          없습니다.
        </p>
      ) : (
        <ul>
          {filteredPostsByTagOnPage.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </ul>
      )}
      <PostsPagination
        generatePageLink={(pageNumber) =>
          `${paths.posts.getHref()}?` +
          createQueryString("page", String(pageNumber))
        }
        activePageNumber={pageNumber}
        numberOfPages={numberOfPages}
      />
    </>
  );
}
