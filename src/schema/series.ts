import { z } from "zod";

export const seriesSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
});

export type Series = z.infer<typeof seriesSchema>;

export const seriesArraySchema = seriesSchema.array();

export type SeriesArray = z.infer<typeof seriesArraySchema>;
