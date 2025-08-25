import { type Metadata } from "next";
import { Heading } from "@/components/heading";
import { Section } from "@/components/section";
import { SeriesList } from "@/components/series/series-list";
import { getSeries } from "@/service/series";

export default async function SeriesPage() {
  const series = await getSeries();

  return (
    <Section>
      <Heading as="h2">시리즈</Heading>
      <SeriesList series={series} />
    </Section>
  );
}

export const metadata: Metadata = {
  title: "시리즈",
  description: "시리즈 목록 페이지입니다.",
};
