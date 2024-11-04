import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode, {
  Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";
import RoundedImage from "./rounded-image";

type Props = {
  contentAsMarkdown: string;
};

const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  theme: {
    dark: "one-dark-pro",
    light: "one-light",
  },
};

export default function PostArticleContent({ contentAsMarkdown }: Props) {
  return (
    <div className="prose prose-zinc dark:prose-invert prose-sm sm:prose-base prose-code:text-sm sm:prose-code:text-base max-w-full">
      <MDXRemote
        source={contentAsMarkdown}
        components={{ img: RoundedImage as any }}
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
