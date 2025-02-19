import { type Metadata } from "next";
import ListHeading from "@/components/list-heading";
import ListSection from "@/components/list-section";
import SeriesList from "@/components/series/series-list";
import { getSeries } from "@/service/series";

export default async function SeriesPage() {
  const series = await getSeries();

  return (
    <ListSection>
      <ListHeading>시리즈</ListHeading>
      <SeriesList series={series} />
    </ListSection>
  );
}

export const metadata: Metadata = {
  title: "시리즈",
  description: "시리즈 목록 페이지입니다.",
};
