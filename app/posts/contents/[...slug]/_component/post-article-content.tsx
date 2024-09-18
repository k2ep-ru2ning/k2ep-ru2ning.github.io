import cn from "@/app/_lib/cn";
import { MDXRemote } from "next-mdx-remote/rsc";
import { HTMLAttributes } from "react";
import remarkGfm from "remark-gfm";

type Props = {
  contentAsMarkdown: string;
};

export default function PostArticleContent({ contentAsMarkdown }: Props) {
  const remarkPlugins = [remarkGfm];

  const Code = ({ children, ...props }: HTMLAttributes<HTMLElement>) => {
    const match = /language-(\w+)/.exec(props.className ?? "");
    if (match) {
      return <code {...props}>{children}</code>;
    } else {
      return (
        <code
          {...props}
          className={cn(
            props.className,
            "before:content-[none] after:content-[none] inline-block px-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-indigo-500",
          )}
        >
          {children}
        </code>
      );
    }
  };

  return (
    <div className="prose dark:prose-invert max-w-full">
      <MDXRemote
        source={contentAsMarkdown}
        options={{ mdxOptions: { remarkPlugins } }}
        components={{
          code: Code,
        }}
      />
    </div>
  );
}
