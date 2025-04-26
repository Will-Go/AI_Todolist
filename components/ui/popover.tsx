"use client";

import * as React from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

const Popover = RadixPopover.Root;
const PopoverTrigger = RadixPopover.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Content>,
  React.ComponentPropsWithoutRef<typeof RadixPopover.Content>
>(({ className, align = "end", sideOffset = 4, ...props }, ref) => (
  <RadixPopover.Portal>
    <RadixPopover.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] rounded-md border border-zinc-700 bg-zinc-800 p-2 text-zinc-100 shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    />
  </RadixPopover.Portal>
));
PopoverContent.displayName = RadixPopover.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
