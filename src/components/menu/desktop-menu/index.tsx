import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import ExternalLinks from "./external-links";
import InternalLinks from "./internal-links";
import ThemeSwitchButton from "./theme-switch-button";

export default function DesktopMenu() {
  return (
    <div className="hidden sm:flex gap-3 h-8">
      <TooltipProvider>
        <InternalLinks />
        <Separator orientation="vertical" />
        <ExternalLinks />
        <Separator orientation="vertical" />
        <ThemeSwitchButton />
      </TooltipProvider>
    </div>
  );
}
