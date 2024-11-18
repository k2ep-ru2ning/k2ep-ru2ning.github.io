import LogoLink from "./logo-link";
import Menu from "./menu";

export default function Header() {
  return (
    <header className="sticky top-0 backdrop-blur-sm flex items-center justify-between py-4">
      <div className="shrink-0">
        <LogoLink />
      </div>
      <Menu />
    </header>
  );
}
