import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-center py-4">
      <Link
        href="/"
        className="flex flex-col text-center divide-y-2 divide-green-500 p-2 hover:bg-green-50 rounded-md"
      >
        <h1 className="font-bold text-3xl">{"Dev-Story"}</h1>
        <strong className="font-normal">{"k2ep-ru2ning"}</strong>
      </Link>
    </header>
  );
}
