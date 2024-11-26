import LogoLink from "./logo-link";
import Menu from "./menu";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-3">
      <div className="shrink-0">
        <LogoLink />
      </div>
      <Menu />
    </header>
  );
}
