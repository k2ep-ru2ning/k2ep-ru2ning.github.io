import Link from "next/link";
import { paths } from "@/config/paths";
import { Button } from "./ui/button";

export function LogoLink() {
  return (
    <Button asChild variant="ghost" className="px-2 font-extrabold text-xl">
      <Link href={paths.home.getHref()}>k2ep-ru2ning</Link>
    </Button>
  );
}
