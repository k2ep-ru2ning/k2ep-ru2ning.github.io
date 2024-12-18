import Link from "next/link";
import { type Series } from "@/schema/series";

type Props = {
  series: Series[];
};

export default function SeriesList({ series }: Props) {
  if (series.length === 0) {
    return <p>시리즈가 존재하지 않습니다.</p>;
  }

  return (
    <ul className="grid sm:grid-cols-2 auto-rows-max gap-4">
      {series.map(({ name, description }) => (
        <li key={name}>
          <Link
            href={`/series/${name}`}
            className="transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 h-full block p-2 rounded-md border border-zinc-300 dark:border-zinc-700"
          >
            <section className="flex flex-col gap-3">
              <h3 className="font-bold text-xl">{name}</h3>
              {description ? <p>{description}</p> : null}
            </section>
          </Link>
        </li>
      ))}
    </ul>
  );
}
