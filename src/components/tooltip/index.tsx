import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { type ReactNode } from "react";

type Props = {
  trigger: ReactNode;
  text: string;
};

export default function Tooltip({ trigger, text }: Props) {
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
          className="text-sm bg-zinc-200 dark:bg-zinc-700 py-1 px-2 rounded-md"
        >
          {text}
          <TooltipPrimitive.Arrow className="fill-zinc-200 dark:fill-zinc-700" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
