"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-forest-950/55 backdrop-blur-[3px]",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  title,
  description,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  title?: string;
  description?: string;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-[22px] border border-line bg-ivory-50 p-6 shadow-[0_40px_100px_-30px_rgba(13,43,35,0.5)] sm:p-7",
          className,
        )}
        {...props}
      >
        {title ? (
          <DialogPrimitive.Title className="pr-10 font-display text-[28px] font-normal leading-tight tracking-[-0.03em] text-forest-900">
            {title}
          </DialogPrimitive.Title>
        ) : null}
        {description ? (
          <DialogPrimitive.Description className="text-sm leading-relaxed text-ink-muted">
            {description}
          </DialogPrimitive.Description>
        ) : null}
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-ink-muted transition-colors hover:bg-ivory-200 hover:text-forest-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500">
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
};
