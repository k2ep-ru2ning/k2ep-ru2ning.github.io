import { type Metadata } from "next";
import Link from "next/link";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import { getSeries } from "@/service/series";

export default async function SeriesPage() {
  const series = await getSeries();

  return (
    <ListSection>
      <ListHeading>시리즈 목록</ListHeading>
      <ul className="grid sm:grid-cols-2 auto-rows-max gap-4">
        {series.map(({ name, description }) => (
          <li key={name}>
            <Link
              href={`/series/${name}`}
              className="transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 h-full block px-3 py-4 rounded-md border border-zinc-300 dark:border-zinc-700"
            >
              <section className="flex flex-col gap-3">
                <h3 className="font-bold text-xl">{name}</h3>
                {description ? <p>{description}</p> : null}
              </section>
            </Link>
          </li>
        ))}
      </ul>
    </ListSection>
  );
}

export const metadata: Metadata = {
  title: "시리즈 목록",
  description: "시리즈 목록 페이지입니다.",
};
