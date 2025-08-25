import { LogoLink } from "./logo-link";
import { Menu } from "./menu";

export function Header() {
  return (
    <header className="h-(--header-height) flex items-center justify-between">
      <div className="shrink-0">
        <LogoLink />
      </div>
      <Menu />
    </header>
  );
}
