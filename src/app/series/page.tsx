import { type Metadata } from "next";
import { SeriesList } from "@/components/series/series-list";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
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
