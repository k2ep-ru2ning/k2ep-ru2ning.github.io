import LogoLink from "./logo-link";
import ThemeDropdown from "./theme-dropdown";

export default function Header() {
  return (
    <header className="flex justify-center py-4 relative">
      <LogoLink />
      <div className="flex gap-4 absolute right-0 top-1/2 -translate-y-1/2">
        <ThemeDropdown />
      </div>
    </header>
  );
}
