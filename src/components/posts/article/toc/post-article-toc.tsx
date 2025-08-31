"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type PostContentHeading } from "@/schema/posts";
import { cn } from "@/utils/cn";
import { HeadingIcon } from "./heading-icon";

type Props = {
  headings: PostContentHeading[];
};

export function PostArticleTOC({ headings }: Props) {
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
    // 부모 요소 아래에 뷰포트의 높이에 따라 동적으로 높이가 변경되는 nav를 sticky하게 붙여놓음.
    // 가장 가까운 스크롤 박스인 뷰포트를 기준으로 위치가 top 80px로 고정됨.
    // main의 상하패딩 총 3rem.
    <nav className="border border-border rounded-md lg:border-0 lg:sticky lg:top-20 lg:h-[calc(100dvh-3rem-var(--header-height)-var(--footer-height))] lg:overflow-hidden">
      <header className="h-[56px] flex justify-between items-center py-3 mx-3 border-b border-b-border">
        <h2 className="text-lg">목차</h2>
      </header>
      <ScrollArea className="lg:h-[calc(100%-56px)]">
        <ul className="py-3 mx-3 flex flex-col gap-1">
          {headings.map((item) => {
            const isActive = activeHeadingIdSet.has(item.id);
            return (
              <li key={item.id}>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "flex justify-start items-baseline gap-2 whitespace-normal h-fit p-1",
                    item.type === "h3" && "pl-6",
                    isActive && "text-brand hover:text-brand",
                  )}
                >
                  <Link href={`#${item.id}`}>
                    <HeadingIcon
                      type={item.type}
                      className={cn(
                        "shrink-0",
                        isActive && "text-brand dark:text-brand",
                      )}
                    />
                    {item.text}
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </nav>
  );
}
