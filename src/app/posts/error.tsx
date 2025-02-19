"use client";

import Link from "next/link";
import { LuFileCode } from "react-icons/lu";

export default function Error() {
  return (
    <div className="py-14 flex flex-col gap-y-3">
      <strong className="text-4xl text-indigo-500 font-bold">400</strong>
      <p className="text-3xl font-bold">잘못된 요청입니다.</p>
      <Link
        href="/posts"
        className="flex items-center gap-1.5 p-1 rounded-md self-start hover:bg-zinc-200 dark:hover:bg-zinc-700"
      >
        글 목록으로 이동
        <LuFileCode className="size-5" />
      </Link>
    </div>
  );
}
