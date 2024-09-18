import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

type Props = {
  contentAsMarkdown: string;
};

export default function PostArticleContent({ contentAsMarkdown }: Props) {
  const remarkPlugins = [remarkGfm];
  return (
    <ReactMarkdown
      className="prose dark:prose-invert prose-pre:p-0 prose-pre:bg-[#2B2B2B] max-w-full"
      components={{
        code(props) {
          const { children, className, node, ref, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              language={match[1]}
              style={darcula}
              showLineNumbers
              customStyle={{
                padding: "0.5em",
              }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              {...rest}
              className={`${className} before:content-[none] after:content-[none] inline-block px-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-indigo-500`}
            >
              {children}
            </code>
          );
        },
      }}
      remarkPlugins={remarkPlugins}
    >
      {contentAsMarkdown}
    </ReactMarkdown>
  );
}
