import Link from "next/link";

type Props = {
  link: string;
  tag: string;
};

export default function TagListItem({ link, tag }: Props) {
  return (
    <Link
      href={link}
      className="block px-2 py-1 rounded-md bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
    >
      {tag}
    </Link>
  );
}
