import * as Tooltip from "@radix-ui/react-tooltip";
import IconLinks from "./links/icon-links";
import LogoLink from "./links/logo-link";
import ThemeSwitchButton from "./theme-switch-button";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4">
      <LogoLink />
      <div className="flex gap-3">
        <Tooltip.Provider delayDuration={400} skipDelayDuration={100}>
          <IconLinks />
          <ThemeSwitchButton />
        </Tooltip.Provider>
      </div>
    </header>
  );
}
