import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { paths } from "@/config/paths";
import { cn } from "@/utils/cn";

export default function HomePage() {
  return (
    <Section className="gap-10 sm:gap-12">
      <header className="flex flex-col gap-1">
        <Heading as="h2">
          k2ep-ru2ning&apos;s <span className="text-brand">Tech Blog</span>
        </Heading>
        <div className="flex flex-col sm:flex-row sm:gap-1 text-sm text-secondary-foreground">
          <span className="before:content-['·'] sm:before:content-none flex gap-1">
            Software Engineer
          </span>
          <span className="before:content-['·'] flex gap-1">
            Front-end Web Developer
          </span>
        </div>
      </header>
      <div className="flex flex-col gap-4 p-2 rounded-md bg-secondary text-secondary-foreground">
        <p>
          <em className="font-bold not-italic">k2ep-ru2ning</em>
          이라는 이름처럼{" "}
          <em className="font-bold not-italic">
            즐겁게 꾸준히 개발하고 싶습니다.
          </em>
        </p>
        <p>
          <em className="font-bold not-italic">
            개발하면서 배우고 경험한 내용을 정리하는 것
          </em>
          을 좋아합니다.
        </p>
        <p>
          요즘에는 <em className="font-bold not-italic">JavaScript</em>와{" "}
          <em className="font-bold not-italic">React</em>를 공부하면서 주로{" "}
          <em className="font-bold not-italic">Front-end</em> 개발을 하고
          있습니다.
        </p>
      </div>
      <ul className="flex flex-col gap-2 sm:gap-0">
        {[
          {
            label: "글",
            link: paths.posts.getHref(),
            description: "프로그래밍 관련 지식과 경험을 기록",
          },
          {
            label: "시리즈",
            link: paths.series.getHref(),
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
            <p className="p-1 text-sm text-secondary-foreground">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
