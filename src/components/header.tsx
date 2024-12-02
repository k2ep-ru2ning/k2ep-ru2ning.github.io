import LogoLink from "./logo-link";
import Menu from "./menu";

export default function Header() {
  return (
    <header className="h-[64px] flex items-center justify-between">
      <div className="shrink-0">
        <LogoLink />
      </div>
      <Menu />
    </header>
  );
}
