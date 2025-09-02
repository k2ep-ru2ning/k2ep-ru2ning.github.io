import Link from "next/link";
import { paths } from "@/config/paths";
import { type Series } from "@/types/series";
import { Heading } from "../ui/heading";

type Props = {
  series: Series[];
};

export function SeriesList({ series }: Props) {
  if (series.length === 0) {
    return <p>시리즈가 존재하지 않습니다.</p>;
  }

  return (
    <ul className="flex flex-col gap-y-4">
      {series.map(({ id, description }) => (
        <li key={id}>
          <Link
            href={paths.seriesDetail.getHref(id)}
            className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 transition-colors p-2 rounded-md border border-border flex flex-col gap-3"
          >
            <Heading as="h3">{id}</Heading>
            {description ? <p>{description}</p> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
