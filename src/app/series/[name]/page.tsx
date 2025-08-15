import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Heading from "@/components/heading";
import Section from "@/components/section";
import PostListOnSeries from "@/components/series/post-list-on-series";
import { getPostsBySeries } from "@/service/posts";
import { getSeries, getSeriesByName } from "@/service/series";

type Props = {
  params: Promise<{
    name: string;
  }>;
};

export default async function SeriesDetailPage({ params }: Props) {
  const seriesName = decodeURIComponent((await params).name);

  const series = await getSeriesByName(seriesName);

  if (!series) {
    notFound();
  }

  const postsOnSeries = await getPostsBySeries(series.name);

  return (
    <Section>
      <Heading as="h2">
        &quot;
        {series.name}
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
  return series.map(({ name }) => ({ name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seriesName = decodeURIComponent((await params).name);

  const series = await getSeriesByName(seriesName);

  if (!series) {
    notFound();
  }

  return {
    title: `"${series.name}" 시리즈`,
    description: series.description,
  };
}
