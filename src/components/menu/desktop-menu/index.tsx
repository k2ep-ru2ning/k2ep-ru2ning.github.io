import * as Tooltip from "@radix-ui/react-tooltip";
import ExternalLinks from "./external-links";
import Links from "./links";
import ThemeSwitchButton from "./theme-switch-button";
import VerticalSeparator from "../../separator/vertical-separator";

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
