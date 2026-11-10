"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-line", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-start justify-between gap-6 py-5 text-left text-[17px] font-semibold leading-snug text-forest-900 transition-colors hover:text-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 sm:text-lg",
          className,
        )}
        {...props}
      >
        {children}
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line bg-white-warm text-forest-800 transition-transform duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:border-forest-700 group-data-[state=open]:bg-forest-900 group-data-[state=open]:text-ivory-50">
          <Plus className="h-4 w-4" aria-hidden="true" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "overflow-hidden text-[15px] leading-relaxed text-ink-muted data-[state=closed]:animate-[pfa-accordion-up_200ms_ease-out] data-[state=open]:animate-[pfa-accordion-down_250ms_ease-out]",
        className,
      )}
      {...props}
    >
      <div className="max-w-2xl pb-6 pr-10">{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
