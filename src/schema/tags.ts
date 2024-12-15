import { z } from "zod";

const VALID_TAGS = [
  "회고",
  "개발 환경 설정",
  "React",
  "Babel",
  "Webpack",
  "Vite",
  "Next.js",
] as const;

export const tagSchema = z.enum(VALID_TAGS);

export type Tag = z.infer<typeof tagSchema>;
