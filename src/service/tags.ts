import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { type Tag, tagArraySchema } from "@/schema/tags";

const TAGS_JSON_FILE_PATH = path.resolve(cwd(), "src", "data", "tags.json");

export async function getTagSet() {
  try {
    const fileContents = await readFile(TAGS_JSON_FILE_PATH, {
      encoding: "utf8",
    });

    // zod로 읽어들인 배열의 스키마 검증 후, 오름차순 정렬
    const tagArray = tagArraySchema
      .parse(JSON.parse(fileContents))
      .sort((tag1, tag2) => tag1.localeCompare(tag2));

    const tagSet = new Set<Tag>();
    for (const tag of tagArray) {
      if (tagSet.has(tag)) {
        throw new Error(
          `중복된 tag가 tags.json 파일에 존재합니다. 중복 tag: "${tag}"`,
        );
      }
      // js의 set은 순서가 유지된다.
      tagSet.add(tag);
    }
    return tagSet;
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
