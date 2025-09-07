import { z } from "zod";

// strictObject -> title, description, createdAt, updatedAt, tags, seriesId 이외의 프로퍼티를 허용안함.
export const postMatterSchema = z.strictObject({
  title: z.string().trim().min(1),
  description: z.string().trim(),
  createdAt: z.date(),
  updatedAt: z.optional(z.date()),
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
  mdxContent: string;
};
