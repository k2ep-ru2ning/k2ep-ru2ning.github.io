import { notFound } from "next/navigation";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import { getSeriesByName } from "@/service/series";

type Props = {
  params: {
    name: string;
  };
};

export default async function SeriesDetailPage({ params }: Props) {
  const seriesName = decodeURIComponent(params.name);

  const seriesByName = await getSeriesByName(seriesName);

  if (!seriesByName) {
    notFound();
  }

  return (
    <ListSection>
      <ListHeading>
        &quot;
        <strong className="underline decoration-wavy decoration-indigo-500">
          {seriesByName.name}
        </strong>
        &quot; 시리즈
      </ListHeading>
      {seriesByName.description ? <p>{seriesByName.description}</p> : null}
    </ListSection>
  );
}
