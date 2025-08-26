"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { ScrollToTopButton } from "./scroll-to-top-button";

export function FixedScrollToTopButton() {
  const targetRef = useRef<HTMLDivElement>(null);

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          setShowButton(false);
        } else {
          setShowButton(true);
        }
      },
      {
        rootMargin: "-64px 0px 0px 0px", // sticky header 영역 제외
      },
    );

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="lg:hidden">
      <div ref={targetRef} />
      <div
        className={cn(
          // 블로그 글 본문 코드블록에 가려지는 문제 해결을 위해 z-index 5로 설정. sticky header에는 가려지도록 헤더의 z-index 10보다는 작게 설정
          "fixed bottom-4 right-4 bg-background rounded-md z-[5]",
          showButton ? "block" : "hidden",
        )}
      >
        <ScrollToTopButton />
      </div>
    </div>
  );
}
