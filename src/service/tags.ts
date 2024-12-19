import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { tagArraySchema } from "@/schema/tags";

const TAGS_JSON_FILE_PATH = path.resolve(cwd(), "src", "contents", "tags.json");

export async function getTagSet() {
  try {
    const fileContents = await readFile(TAGS_JSON_FILE_PATH, {
      encoding: "utf8",
    });

    // zod로 읽어들인 배열의 스키마 검증 후, 오름차순 정렬
    const tagArray = tagArraySchema
      .parse(JSON.parse(fileContents))
      .sort((tag1, tag2) => tag1.localeCompare(tag2));

    return new Set(tagArray);
  } catch (e) {
    throw new Error(
      "tags.json 파일을 read, parse 하는데 문제가 발생했습니다.",
      { cause: e },
    );
  }
}

export async function getTags() {
  const tagSet = await getTagSet();
  return [...tagSet];
}
