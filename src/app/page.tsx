import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Heading from "@/components/heading";
import Section from "@/components/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

export default function HomePage() {
  return (
    <Section className="gap-10 sm:gap-12">
      <header className="flex flex-col gap-1">
        <Heading as="h2">
          k2ep-ru2ning&apos;s <span className="text-indigo-500">Tech Blog</span>
        </Heading>
        <div className="flex flex-col sm:flex-row sm:gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          <div className="before:content-['·'] sm:before:content-none flex gap-1">
            Software Engineer
          </div>
          <div className="before:content-['·'] flex gap-1">
            Front-end Web Developer
          </div>
        </div>
      </header>
      <div className="flex flex-col gap-4 p-2 rounded-md bg-zinc-200 dark:bg-zinc-800">
        <p>
          <span className="font-bold">k2ep-ru2ning</span>
          이라는 이름처럼{" "}
          <span className="font-bold">즐겁게 꾸준히 개발하고 싶습니다.</span>
        </p>
        <p>
          <span className="font-bold">
            개발하면서 배우고 경험한 내용을 정리하는 것
          </span>
          을 좋아합니다.
        </p>
        <p>
          요즘에는 <span className="font-bold">JavaScript</span>와{" "}
          <span className="font-bold">React</span>를 공부하면서 주로{" "}
          <span className="font-bold">Front-end</span> 개발을 하고 있습니다.
        </p>
      </div>
      <ul className="flex flex-col gap-2 sm:gap-0">
        {[
          {
            label: "글",
            link: "/posts",
            description: "프로그래밍 관련 지식과 경험을 기록",
          },
          {
            label: "시리즈",
            link: "/series",
            description: "연관된 글끼리 묶어서 시리즈 형태로 편집",
          },
        ].map(({ label, link, description }, index) => (
          <li
            key={index}
            className="flex flex-col items-start sm:flex-row sm:gap-3 sm:items-center"
          >
            <div className="w-20">
              <Button
                asChild
                size="sm"
                variant="ghost"
                className={cn("has-[>svg]:p-1")}
              >
                <Link href={link}>
                  {label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <p className="p-1 text-sm text-zinc-700 dark:text-zinc-300">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
