import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode, {
  Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";

type Props = {
  contentAsMarkdown: string;
};

const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  theme: "one-dark-pro",
};

export default function PostArticleContent({ contentAsMarkdown }: Props) {
  return (
    <div className="prose prose-zinc dark:prose-invert prose-sm sm:prose-base prose-code:text-sm sm:prose-code:text-base max-w-full">
      <MDXRemote
        source={contentAsMarkdown}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
          },
        }}
      />
    </div>
  );
}
