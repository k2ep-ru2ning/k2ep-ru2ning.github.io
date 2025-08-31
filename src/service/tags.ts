import { type Tag } from "@/types/tags";

const tags: Tag[] = [
  "회고",
  "개발 환경 설정",
  "상태 관리",
  "React",
  "Babel",
  "Webpack",
  "Vite",
  "Next.js",
  "algorithm",
  "MobX",
  "TypeScript",
  "C++",
  "Troubleshooting",
];

tags.sort((tag1, tag2) => tag1.localeCompare(tag2));

const tagSet = new Set(tags);

if (tagSet.size !== tags.length) {
  throw new Error("tags에 같은 이름의 태그를 작성했어요. 수정해주세요.");
}

export function getTags() {
  return [...tagSet];
}

export function isValidTag(value: string) {
  return tagSet.has(value);
}
