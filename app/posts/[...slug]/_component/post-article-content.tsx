import ReactMarkdown from "react-markdown";

type Props = {
  contentAsMarkdown: string;
};

export default function PostArticleContent({ contentAsMarkdown }: Props) {
  return (
    <ReactMarkdown className="prose dark:prose-invert max-w-full">
      {contentAsMarkdown}
    </ReactMarkdown>
  );
}
