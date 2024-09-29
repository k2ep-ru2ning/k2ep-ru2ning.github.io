import IconLinks from "./links/icon-links";
import LogoLink from "./links/logo-link";
import ThemeSwitchButton from "./theme-switch-button";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4">
      <LogoLink />
      <div className="flex gap-3">
        <IconLinks />
        <ThemeSwitchButton />
      </div>
    </header>
  );
}
