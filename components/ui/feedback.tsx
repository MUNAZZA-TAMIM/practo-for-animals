"use client";

import * as React from "react";
import { Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("inline-flex", className)}
      {...props}
    >
      <LoaderCircle
        className="animate-[pfa-spin_900ms_linear_infinite]"
        aria-hidden="true"
      />
    </span>
  );
}

function Checkbox({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <span className={cn("relative mt-0.5 inline-flex h-5 w-5 shrink-0", className)}>
      <input
        type="checkbox"
        className="peer h-5 w-5 cursor-pointer appearance-none rounded-[5px] border border-forest-900/25 bg-white-warm transition-colors checked:border-forest-900 checked:bg-forest-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      <Check
        className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-ivory-50 opacity-0 peer-checked:opacity-100"
        strokeWidth={3}
        aria-hidden="true"
      />
    </span>
  );
}

function ConsentField({
  id,
  label,
  error,
}: {
  id: string;
  label: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[13px] leading-5 text-ink-muted">
        <Checkbox id={id} name={id} />
        <span>{label}</span>
      </label>
      {error ? (
        <p role="alert" className="mt-1.5 pl-8 text-[12.5px] text-danger-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Checkbox, ConsentField, Spinner };
