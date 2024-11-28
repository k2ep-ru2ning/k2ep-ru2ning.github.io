import ExternalLinks from "./external-links";
import InternalLinks from "./internal-links";
import ThemeSwitchButton from "./theme-switch-button";
import VerticalSeparator from "../../separator/vertical-separator";
import TooltipProvider from "../../tooltip/tooltip-provider";

export default function DesktopMenu() {
  return (
    <TooltipProvider>
      <div className="hidden sm:flex gap-3 h-8">
        <InternalLinks />
        <VerticalSeparator />
        <ExternalLinks />
        <VerticalSeparator />
        <ThemeSwitchButton />
      </div>
    </TooltipProvider>
  );
}
