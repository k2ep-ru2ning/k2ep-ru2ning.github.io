import * as Tooltip from "@radix-ui/react-tooltip";
import Links from "./links";
import VerticalSeparator from "../../separator/vertical-separator";
import ExternalLinks from "./external-links";
import ThemeSwitchButton from "./theme-switch-button";

export default function DesktopMenu() {
  return (
    <div className="hidden sm:flex gap-3 h-8">
      <Tooltip.Provider delayDuration={400} skipDelayDuration={100}>
        <Links />
        <VerticalSeparator />
        <ExternalLinks />
        <VerticalSeparator />
        <ThemeSwitchButton />
      </Tooltip.Provider>
    </div>
  );
}
