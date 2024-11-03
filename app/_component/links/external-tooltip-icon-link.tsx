import * as Tooltip from "@radix-ui/react-tooltip";
import { type ReactNode } from "react";
import { LuExternalLink } from "react-icons/lu";

type Props = {
  icon: ReactNode;
  href: string;
  tooltipText: string;
};

export default function ExternalTooltipIconLink({
  href,
  tooltipText,
  icon,
}: Props) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-zinc-200 dark:hover:bg-zinc-700 size-8 flex justify-center items-center rounded-md"
        >
          {icon}
        </a>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="bottom"
          sideOffset={8}
          className="text-sm bg-zinc-200 dark:bg-zinc-700 py-1 px-2 rounded-md flex gap-1 items-center"
        >
          {tooltipText}
          <LuExternalLink />
          <Tooltip.Arrow className="fill-zinc-200 dark:fill-zinc-700" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
