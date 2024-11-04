import * as Tooltip from "@radix-ui/react-tooltip";
import Links from "./links/links";
import LogoLink from "./links/logo-link";
import ThemeSwitchButton from "./theme-switch-button";
import ExternalLinks from "./links/external-links";
import VerticalSeparator from "./separator/vertical-separator";
import HorizontalSeparator from "./horizontal-separator";

export default function Header() {
  return (
    <header className="sticky top-0 backdrop-blur-sm">
      <div className="flex items-center justify-between py-4">
        <LogoLink />
        <div className="flex gap-3 h-8">
          <Tooltip.Provider delayDuration={400} skipDelayDuration={100}>
            <Links />
            <VerticalSeparator />
            <ExternalLinks />
            <VerticalSeparator />
            <ThemeSwitchButton />
          </Tooltip.Provider>
        </div>
      </div>
      <HorizontalSeparator />
    </header>
  );
}
