import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { Series, seriesArraySchema } from "@/schema/series";

const SERIES_JSON_FILE_PATH = path.resolve(
  cwd(),
  "src",
  "contents",
  "series.json",
);

// 모든 시리즈를 조회하는 함수
export async function getSeries() {
  try {
    const fileContents = await readFile(SERIES_JSON_FILE_PATH, {
      encoding: "utf8",
    });

    // zod로 읽어들인 배열의 스키마 검증
    const seriesArray = seriesArraySchema.parse(JSON.parse(fileContents));

    // 읽어온 json 파일에서 name 속성의 중복 여부 검증
    const seriesMap = new Map<Series["name"], Series>();
    for (const series of seriesArray) {
      if (seriesMap.has(series.name)) {
        throw new Error(
          "series.json 파일에 중복된 name을 가진 series 들이 존재합니다.",
        );
      }
      seriesMap.set(series.name, series);
    }

    return [...seriesMap.values()].sort((s1, s2) =>
      s1.name.localeCompare(s2.name),
    );
  } catch (e) {
    throw new Error(
      "series.json 파일을 read, parse 하는데 문제가 발생했습니다.",
      { cause: e },
    );
  }
}

export async function getSeriesNameSet() {
  const series = await getSeries();
  return new Set(series.map((s) => s.name));
}

export async function getSeriesByName(name: string) {
  const series = await getSeries();
  return series.find((s) => s.name === name);
}
