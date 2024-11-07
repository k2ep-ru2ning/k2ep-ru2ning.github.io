import * as Tooltip from "@radix-ui/react-tooltip";
import Links from "./links/links";
import LogoLink from "./links/logo-link";
import ThemeSwitchButton from "./theme-switch-button";
import ExternalLinks from "./links/external-links";
import VerticalSeparator from "./separator/vertical-separator";
import MenuDialog from "./menu-dialog";

export default function Header() {
  return (
    <header className="sticky top-0 backdrop-blur-sm flex items-center justify-between py-4">
      <div className="shrink-0">
        <LogoLink />
      </div>
      <div className="flex gap-3 h-8 sm:hidden">
        <MenuDialog />
      </div>
      <div className="hidden sm:flex gap-3 h-8">
        <Tooltip.Provider delayDuration={400} skipDelayDuration={100}>
          <Links />
          <VerticalSeparator />
          <ExternalLinks />
          <VerticalSeparator />
          <ThemeSwitchButton />
        </Tooltip.Provider>
      </div>
    </header>
  );
}
