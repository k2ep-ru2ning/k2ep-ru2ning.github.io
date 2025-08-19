import Link from "next/link";
import { paths } from "@/config/paths";
import { type Series } from "@/schema/series";
import Heading from "../heading";

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
            href={paths.seriesDetail.getHref(name)}
            className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 transition-colors h-full p-2 rounded-md border border-border flex flex-col gap-3"
          >
            <Heading as="h3">{name}</Heading>
            {description ? <p>{description}</p> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
