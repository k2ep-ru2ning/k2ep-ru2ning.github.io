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
          href={`/tags/${tag}/pages/1`}
          className="block px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
