import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  contentAsMarkdown: string;
};

export default function PostArticleContent({ contentAsMarkdown }: Props) {
  const remarkPlugins = [remarkGfm];
  return (
    <ReactMarkdown
      className="prose dark:prose-invert max-w-full"
      remarkPlugins={remarkPlugins}
    >
      {contentAsMarkdown}
    </ReactMarkdown>
  );
}
