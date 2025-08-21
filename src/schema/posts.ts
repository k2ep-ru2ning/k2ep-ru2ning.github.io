import { z } from "zod";
import { seriesSchema } from "./series";
import { tagArraySchema } from "./tags";

export const postMatterSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim(),
  createdAt: z.date(),
  tags: tagArraySchema.optional(),
  series: seriesSchema.shape.id.optional(),
});

type PostMatter = z.infer<typeof postMatterSchema>;

export type PostContentHeadingType = "h2" | "h3";

export type PostContentHeading = {
  type: PostContentHeadingType;
  text: string;
  id: string;
};

export type Post = PostMatter & {
  id: string;
  rawContent: string; // 읽어들인 .md, .mdx 파일 내용
  bundledContent: string; // mdx-bundler에 의해 처리된 파일 내용
  headings: PostContentHeading[];
};
