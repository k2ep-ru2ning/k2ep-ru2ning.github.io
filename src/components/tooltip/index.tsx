import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { type ReactNode } from "react";

type Props = {
  trigger: ReactNode;
  content: ReactNode;
};

export default function Tooltip({ trigger, content }: Props) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger
        asChild
        className="hover:bg-zinc-200 dark:hover:bg-zinc-700 flex justify-center items-center rounded-md"
      >
        {trigger}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="bottom"
          sideOffset={8}
          className="z-10 text-sm bg-zinc-200 dark:bg-zinc-700 py-1 px-2 rounded-md"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-zinc-200 dark:fill-zinc-700" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
