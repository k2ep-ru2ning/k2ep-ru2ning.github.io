import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";

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
    return JSON.parse(fileContents);
  } catch (e) {
    throw new Error(
      "series.json 파일을 read, parse 하는데 문제가 발생했습니다.",
      { cause: e },
    );
  }
}
