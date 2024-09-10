import Link from "next/link";

type Props = {
  tags?: string[];
};

export default function TagList({ tags }: Props) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {tags.map((tag, index) => (
        <Link
          key={index}
          href={`/tags/${tag}/pages/1`}
          className="block px-2 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
