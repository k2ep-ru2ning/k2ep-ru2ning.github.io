import { TooltipProvider } from "@/components/ui/tooltip";
import ExternalLinks from "./external-links";
import InternalLinks from "./internal-links";
import ThemeSwitchButton from "./theme-switch-button";
import VerticalSeparator from "../../separator/vertical-separator";

export default function DesktopMenu() {
  return (
    <div className="hidden sm:flex gap-3 h-8">
      <TooltipProvider>
        <InternalLinks />
        <VerticalSeparator />
        <ExternalLinks />
        <VerticalSeparator />
        <ThemeSwitchButton />
      </TooltipProvider>
    </div>
  );
}
