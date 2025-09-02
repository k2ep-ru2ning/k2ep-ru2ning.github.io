import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { PostListOnSeries } from "@/components/series/post-list-on-series";
import { Heading } from "@/components/ui/heading";
import { getPostsBySeries } from "@/service/posts";
import { getSeries, getSeriesById } from "@/service/series";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SeriesDetailPage({ params }: Props) {
  // next의 props가 decode 된 상태가 아니라서, 직접 decoding 해주어야 함.
  const seriesId = decodeURIComponent((await params).id);

  const series = getSeriesById(seriesId);

  if (!series) {
    notFound();
  }

  const postsOnSeries = await getPostsBySeries(series.id);

  return (
    <main className="max-w-(--content-max-width) mx-auto px-(--content-horizontal-padding) flex flex-col gap-6">
      <Heading as="h2">
        &quot;
        <span className="text-brand">{series.id}</span>
        &quot; 시리즈
      </Heading>
      {series.description ? (
        <p className="p-2 rounded-md bg-secondary text-secondary-foreground">
          {series.description}
        </p>
      ) : null}
      <PostListOnSeries postsOnSeries={postsOnSeries} />
    </main>
  );
}

export function generateStaticParams() {
  const series = getSeries();
  return series.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seriesId = decodeURIComponent((await params).id);

  const series = getSeriesById(seriesId);

  if (!series) {
    notFound();
  }

  return {
    title: `"${series.id}" 시리즈`,
    description: series.description,
  };
}
