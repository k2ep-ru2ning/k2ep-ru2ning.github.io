import { type Metadata } from "next";
import { SeriesList } from "@/components/series/series-list";
import { Heading } from "@/components/ui/heading";
import { getSeries } from "@/service/series";

export default function SeriesPage() {
  const series = getSeries();

  return (
    <main className="max-w-(--content-max-width) mx-auto px-(--content-horizontal-padding) flex flex-col gap-6">
      <Heading as="h2">시리즈</Heading>
      <SeriesList series={series} />
    </main>
  );
}

export const metadata: Metadata = {
  title: "시리즈",
  description: "시리즈 목록 페이지입니다.",
};
