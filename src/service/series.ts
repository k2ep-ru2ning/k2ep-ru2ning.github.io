import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { Series, seriesArraySchema } from "@/schema/series";

const SERIES_JSON_FILE_PATH = path.resolve(cwd(), "src", "data", "series.json");

// 모든 시리즈를 조회하는 함수
export async function getSeries() {
  try {
    const fileContents = await readFile(SERIES_JSON_FILE_PATH, {
      encoding: "utf8",
    });

    // zod로 읽어들인 배열의 스키마 검증
    const seriesArray = seriesArraySchema.parse(JSON.parse(fileContents));

    // 읽어온 json 파일에서 id 속성의 중복 여부 검증
    const seriesMap = new Map<Series["id"], Series>();
    for (const series of seriesArray) {
      if (seriesMap.has(series.id)) {
        throw new Error(
          "series.json 파일에 중복된 id를 가진 series 들이 존재합니다.",
        );
      }
      seriesMap.set(series.id, series);
    }

    return [...seriesMap.values()].sort((s1, s2) => s1.id.localeCompare(s2.id));
  } catch (e) {
    throw new Error(
      "series.json 파일을 read, parse 하는데 문제가 발생했습니다.",
      { cause: e },
    );
  }
}

export async function getSeriesIdSet() {
  const series = await getSeries();
  return new Set(series.map((s) => s.id));
}

export async function getSeriesById(id: Series["id"]) {
  const series = await getSeries();
  return series.find((s) => s.id === id);
}
