import Link from "next/link";

export default function LogoLink() {
  return (
    <Link
      href="/"
      className="flex flex-col text-center px-2 py-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
    >
      <h1 className="font-extrabold text-xl">k2ep-ru2ning</h1>
    </Link>
  );
}
