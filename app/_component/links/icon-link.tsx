import cn from "@/app/_lib/cn";
import Link from "next/link";
import { ReactNode, type ComponentProps } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

type Props = Pick<ComponentProps<typeof Link>, "href"> & {
  icon: ReactNode;
  tooltipText: string;
  isActive: boolean;
};

export default function IconLink({ href, icon, tooltipText, isActive }: Props) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Link
          href={href}
          className={cn(
            "hover:bg-zinc-200 dark:hover:bg-zinc-700 size-8 flex justify-center items-center rounded-md",
            isActive && "text-indigo-500",
          )}
        >
          {icon}
        </Link>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="bottom"
          sideOffset={8}
          className="text-sm bg-zinc-200 dark:bg-zinc-700 py-1 px-2 rounded-md"
        >
          {tooltipText}
          <Tooltip.Arrow className="fill-zinc-200 dark:fill-zinc-700" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
