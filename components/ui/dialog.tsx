"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/70 backdrop-blur-xs transition-all animate-in fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-zinc-900 border border-zinc-700 p-6 shadow-2xl focus:outline-none transition-all animate-in fade-in-0 scale-in-95",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 space-y-1 text-center sm:text-left">{children}</div>
);

export const DialogTitle = (
  props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
) => (
  <DialogPrimitive.Title
    {...props}
    className={cn("text-lg font-semibold text-zinc-100", props.className)}
  />
);

export const DialogDescription = (
  props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
) => (
  <DialogPrimitive.Description
    {...props}
    className={cn("text-sm text-zinc-400", props.className)}
  />
);

export const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-end gap-2 mt-6">{children}</div>
);
