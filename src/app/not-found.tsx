import { House } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="py-14 flex flex-col gap-y-3">
      <strong className="text-4xl text-indigo-500 font-bold">404</strong>
      <p className="text-3xl font-bold">페이지를 찾을 수 없어요</p>
      <p className="text-xl">주소를 확인해주세요</p>
      <Button variant="ghost" asChild size="sm" className="self-start">
        <Link href="/" replace>
          Home으로 이동
          <House className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
