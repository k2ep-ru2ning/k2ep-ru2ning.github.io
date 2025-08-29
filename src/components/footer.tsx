import { owner } from "@/config/const";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="h-(--footer-height) flex flex-col justify-center items-center">
      <p>
        &copy; {year} {owner}
      </p>
    </footer>
  );
}
