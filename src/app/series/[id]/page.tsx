import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { Heading } from "@/components/heading";
import { Section } from "@/components/section";
import { PostListOnSeries } from "@/components/series/post-list-on-series";
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

  const series = await getSeriesById(seriesId);

  if (!series) {
    notFound();
  }

  const postsOnSeries = await getPostsBySeries(series.id);

  return (
    <Section>
      <Heading as="h2">
        &quot;
        {series.id}
        &quot; 시리즈
      </Heading>
      {series.description ? (
        <p className="p-2 rounded-md bg-secondary text-secondary-foreground">
          {series.description}
        </p>
      ) : null}
      <PostListOnSeries postsOnSeries={postsOnSeries} />
    </Section>
  );
}

export async function generateStaticParams() {
  const series = await getSeries();
  return series.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seriesId = decodeURIComponent((await params).id);

  const series = await getSeriesById(seriesId);

  if (!series) {
    notFound();
  }

  return {
    title: `"${series.id}" 시리즈`,
    description: series.description,
  };
}
