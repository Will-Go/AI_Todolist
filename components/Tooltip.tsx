"use client";

import React from "react";
import {
  TooltipWrapper,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
  /**
   * The element that should trigger the tooltip (e.g., a button, icon, etc.)
   */
  children: React.ReactNode;
  /**
   * The content to display inside the tooltip
   */
  content: React.ReactNode;
  /**
   * Optional: show/hide the tooltip arrow
   */
  arrow?: boolean;
  /**
   * Optional: side offset for the tooltip
   */
  sideOffset?: number;
  /**
   * Optional: additional className for TooltipContent
   */
  className?: string;

  side?: "top" | "right" | "bottom" | "left";
}

export default function Tooltip({
  children,
  content,
  arrow = true,
  sideOffset = 6,
  className,
  side,
  ...props
}: TooltipWrapperProps) {
  return (
    <TooltipProvider>
      <TooltipWrapper>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          arrow={arrow}
          sideOffset={sideOffset}
          className={className}
          side={side}
          {...props}
        >
          {content}
        </TooltipContent>
      </TooltipWrapper>
    </TooltipProvider>
  );
}
