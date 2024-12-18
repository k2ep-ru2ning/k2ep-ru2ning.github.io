import { type Metadata } from "next";
import { notFound } from "next/navigation";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import PostListOnSeries from "@/components/series/post-list-on-series";
import { getPostsBySeries } from "@/service/posts";
import { getSeries, getSeriesByName } from "@/service/series";

type Props = {
  params: {
    name: string;
  };
};

export default async function SeriesDetailPage({ params }: Props) {
  const seriesName = decodeURIComponent(params.name);

  const series = await getSeriesByName(seriesName);

  if (!series) {
    notFound();
  }

  const postsOnSeries = await getPostsBySeries(series.name);

  return (
    <ListSection>
      <ListHeading>
        &quot;
        <strong className="underline decoration-wavy decoration-indigo-500">
          {series.name}
        </strong>
        &quot; 시리즈
      </ListHeading>
      {series.description ? (
        <p className="p-2 rounded-md bg-zinc-200 dark:bg-zinc-800">
          {series.description}
        </p>
      ) : null}
      <PostListOnSeries postsOnSeries={postsOnSeries} />
    </ListSection>
  );
}

export async function generateStaticParams() {
  const series = await getSeries();
  return series.map(({ name }) => ({ name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seriesName = decodeURIComponent(params.name);

  const series = await getSeriesByName(seriesName);

  if (!series) {
    notFound();
  }

  return {
    title: `"${series.name}" 시리즈`,
    description: series.description,
  };
}
