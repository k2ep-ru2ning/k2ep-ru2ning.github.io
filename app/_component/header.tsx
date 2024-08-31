import LogoLink from "./logo-link";
import TagsLink from "./tags-link";
import ThemeSwitchDropdown from "./theme-switch-dropdown";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4">
      <LogoLink />
      <div className="flex gap-3">
        <ThemeSwitchDropdown />
        <TagsLink />
      </div>
    </header>
  );
}
