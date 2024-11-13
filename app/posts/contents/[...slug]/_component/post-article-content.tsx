import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypePrettyCode, {
  Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";
import RoundedImage from "./rounded-image";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";

type Props = {
  contentAsMarkdown: string;
};

const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  theme: {
    dark: "one-dark-pro",
    light: "one-light",
  },
};

export default async function PostArticleContent({ contentAsMarkdown }: Props) {
  const { code } = await bundleMDX({
    source: contentAsMarkdown,
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkGfm,
        remarkBreaks,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [rehypePrettyCode, rehypePrettyCodeOptions],
      ];
      return options;
    },
  });

  const MDXComponent = getMDXComponent(code);

  return (
    <div className="prose prose-zinc dark:prose-invert prose-sm sm:prose-base prose-code:text-sm sm:prose-code:text-base max-w-full">
      <MDXComponent
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        components={{ img: RoundedImage as any }}
      />
    </div>
  );
}
