import { z } from "zod";

export const tagSchema = z.string().trim().min(1);

export type Tag = z.infer<typeof tagSchema>;

export const tagArraySchema = tagSchema.array();

export type TagArray = z.infer<typeof tagArraySchema>;
