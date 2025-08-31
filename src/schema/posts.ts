import { z } from "zod";

// strictObject -> title, description, createdAt, tags, seriesId 이외의 프로퍼티를 허용안함.
export const postMatterSchema = z.strictObject({
  title: z.string().trim().min(1),
  description: z.string().trim(),
  createdAt: z.date(),
  tags: z.optional(z.array(z.string().trim().min(1))),
  seriesId: z.optional(z.string().trim().min(1)),
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
