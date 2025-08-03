import { Tooltip as TooltipPrimitive } from "radix-ui";
import { type PropsWithChildren } from "react";

export default function TooltipProvider({ children }: PropsWithChildren) {
  return (
    <TooltipPrimitive.Provider delayDuration={100} skipDelayDuration={100}>
      {children}
    </TooltipPrimitive.Provider>
  );
}
