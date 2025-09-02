import { House } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { paths } from "@/config/paths";

export default function NotFound() {
  return (
    <main className="max-w-(--content-max-width) mx-auto px-(--content-horizontal-padding) flex flex-col gap-6">
      <strong className="text-4xl text-brand font-bold">404</strong>
      <section className="flex flex-col gap-2">
        <Heading as="h1">페이지를 찾을 수 없어요</Heading>
        <p className="text-xl">주소를 확인해주세요</p>
      </section>
      <Button variant="secondary" asChild size="sm" className="self-start">
        <Link href={paths.home.getHref()} replace>
          Home으로 이동
          <House className="size-4" />
        </Link>
      </Button>
    </main>
  );
}
