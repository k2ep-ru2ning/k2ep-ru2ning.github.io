import LogoLink from "./logo-link";
import MobileMenu from "./mobile-menu";
import DesktopMenu from "./desktop-menu";

export default function Header() {
  return (
    <header className="sticky top-0 backdrop-blur-sm flex items-center justify-between py-4">
      <div className="shrink-0">
        <LogoLink />
      </div>
      <MobileMenu />
      <DesktopMenu />
    </header>
  );
}
