import Link from "next/link";
import { LuHome } from "react-icons/lu";

export default function NotFound() {
  return (
    <div className="py-14 flex flex-col gap-y-3">
      <strong className="text-4xl text-indigo-500 font-bold">404</strong>
      <p className="text-3xl font-bold">페이지를 찾을 수 없어요</p>
      <p className="text-xl">주소를 확인해주세요</p>
      <Link
        href="/"
        className="flex items-center gap-1.5 p-1 rounded-md self-start hover:bg-zinc-200 dark:hover:bg-zinc-700"
      >
        Home으로 이동
        <LuHome className="size-5" />
      </Link>
    </div>
  );
}
