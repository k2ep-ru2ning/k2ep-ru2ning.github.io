import { z } from "zod";

export const seriesSchema = z.object({
  id: z.string().trim().min(1), // "업무 회고록", "개인 웹 사이트 개발" 처럼 읽을 수 있는 형태의 id
  description: z.string().trim().min(1).optional(),
});

export type Series = z.infer<typeof seriesSchema>;

export const seriesArraySchema = seriesSchema.array();

export type SeriesArray = z.infer<typeof seriesArraySchema>;
