import { type Series } from "@/types/series";

const seriesList: Series[] = [
  {
    id: "업무 회고록",
    description: "회사 업무를 진행하면서 기록하고 싶은 것들을 맘껏 정리하자!",
  },
  {
    id: "개인 웹 사이트 개발",
    description:
      "Next.js로 개인 웹 사이트를 개발하면서 했던 생각, 겪었던 문제를 해결했던 과정을 정리",
  },
  {
    id: "React 개발 환경 직접 설정하기",
    description:
      "Vite, CRA 같은 편리한 도구를 사용하는 대신, Webpack과 Babel 기반으로 직접 React 개발 환경 설정하기",
  },
];

seriesList.sort((s1, s2) => s1.id.localeCompare(s2.id));

const seriesMap = new Map<Series["id"], Series>(
  seriesList.map((series) => [series.id, series]),
);

if (seriesMap.size !== seriesList.length) {
  throw new Error(
    "seriesList에 같은 id를 갖는 시리즈를 작성했어요. 수정해주세요.",
  );
}

// 모든 시리즈를 조회하는 함수
export function getSeries() {
  return [...seriesMap.values()];
}

export function isValidSeriesId(value: string) {
  return seriesMap.has(value);
}

export function getSeriesById(id: Series["id"]) {
  return seriesMap.get(id);
}
