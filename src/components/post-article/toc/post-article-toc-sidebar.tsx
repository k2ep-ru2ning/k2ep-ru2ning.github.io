"use client";

import { useEffect, useState } from "react";
import { type PostContentHeading } from "@/service/posts";
import PostArticleTOCItem from "./post-article-toc-item";
import HorizontalSeparator from "../../separator/horizontal-separator";

type Props = {
  headings: PostContentHeading[];
};

export default function PostArticleTOCSidebar({ headings }: Props) {
  const [activeHeadingIdSet, setActiveHeadingIdSet] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    const sectionElements = document.querySelectorAll(
      "#article-content section",
    );

    // 변경사항이 있을 때마다 callback 호출된다.
    // entries 배열에는 가시성에 변경사항이 있는 관찰 대상만 요소로 들어간다.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const heading = entry.target.querySelector("h2,h3");
          if (!heading) continue;
          const id = heading.getAttribute("id");
          if (!id) continue;
          if (entry.isIntersecting) {
            setActiveHeadingIdSet((prev) => {
              const nxt = new Set(prev);
              nxt.add(id);
              return nxt;
            });
          } else {
            setActiveHeadingIdSet((prev) => {
              const nxt = new Set(prev);
              nxt.delete(id);
              return nxt;
            });
          }
        }
      },
      {
        rootMargin: "-64px 0px 0px 0px", // sticky header 영역 제외
      },
    );

    sectionElements.forEach((sectionElement) =>
      observer.observe(sectionElement),
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="max-h-full rounded-md border border-zinc-300 dark:border-zinc-700 p-3 flex flex-col gap-3">
      <h2 className="text-lg shrink-0">목차</h2>
      <HorizontalSeparator />
      <nav className="flex-grow overflow-auto">
        <ul className="flex flex-col gap-1">
          {headings.map((item) => (
            <PostArticleTOCItem
              key={item.id}
              type={item.type}
              link={`#${item.id}`}
              text={item.text}
              isActive={activeHeadingIdSet.has(item.id)}
            />
          ))}
        </ul>
      </nav>
    </section>
  );
}
