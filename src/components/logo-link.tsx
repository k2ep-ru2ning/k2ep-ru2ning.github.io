import Link from "next/link";
import { paths } from "@/config/paths";
import { Button } from "./ui/button";

export function LogoLink() {
  return (
    <Button asChild variant="ghost" className="px-2">
      <Link href={paths.home.getHref()}>
        <h1 className="font-extrabold text-xl">k2ep-ru2ning</h1>
      </Link>
    </Button>
  );
}
