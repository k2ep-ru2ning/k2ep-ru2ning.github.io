import { notFound } from "next/navigation";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import PostList from "@/components/post-list";
import { getPostsBySeries } from "@/service/posts";
import { getSeriesByName } from "@/service/series";

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
      {series.description ? <p>{series.description}</p> : null}
      <PostList posts={postsOnSeries} />
    </ListSection>
  );
}
