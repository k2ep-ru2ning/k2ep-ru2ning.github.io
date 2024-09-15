import LogoLink from "./links/logo-link";
import PostsIconLink from "./links/posts-icon-link";
import TagsIconLink from "./links/tags-icon-link";
import ThemeSwitchDropdown from "./theme-switch-dropdown";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4">
      <LogoLink />
      <div className="flex gap-3">
        <nav className="flex gap-3">
          <PostsIconLink />
          <TagsIconLink />
        </nav>
        <ThemeSwitchDropdown />
      </div>
    </header>
  );
}
