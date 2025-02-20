import { type Metadata } from "next";
import ListHeading from "@/components/list-heading";
import Section from "@/components/section";
import SeriesList from "@/components/series/series-list";
import { getSeries } from "@/service/series";

export default async function SeriesPage() {
  const series = await getSeries();

  return (
    <Section>
      <ListHeading>시리즈</ListHeading>
      <SeriesList series={series} />
    </Section>
  );
}

export const metadata: Metadata = {
  title: "시리즈",
  description: "시리즈 목록 페이지입니다.",
};
