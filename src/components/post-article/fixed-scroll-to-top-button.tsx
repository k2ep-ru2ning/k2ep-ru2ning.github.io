"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils";
import ScrollToTopButton from "./scroll-to-top-button";

export default function FixedScrollToTopButton() {
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
          "fixed bottom-4 right-4",
          showButton ? "block" : "hidden",
        )}
      >
        <ScrollToTopButton size="large" />
      </div>
    </div>
  );
}
