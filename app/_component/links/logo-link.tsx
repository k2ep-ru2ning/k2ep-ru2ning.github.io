import Link from "next/link";

export default function LogoLink() {
  return (
    <Link
      href="/"
      className="flex flex-col text-center divide-y-2 divide-indigo-500 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <h1 className="font-bold text-xl">{"Dev-Story"}</h1>
      <strong className="font-normal">{"k2ep-ru2ning"}</strong>
    </Link>
  );
}
