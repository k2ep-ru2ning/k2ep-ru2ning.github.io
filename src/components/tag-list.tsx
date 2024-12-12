import Link from "next/link";

type Props = {
  tags: string[];
};

export default function TagList({ tags }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {tags.map((tag, index) => (
        <Link
          key={index}
          href={`/tags/${tag}`}
          className="block px-2 py-1 rounded-md bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
