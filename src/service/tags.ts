import { type Tag } from "@/schema/tags";

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

export function getTags() {
  return [...tagSet];
}

export function isValidTag(value: string) {
  return tagSet.has(value);
}
