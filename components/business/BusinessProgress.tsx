"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Business info" },
  { id: 2, label: "Services & animals" },
  { id: 3, label: "Location" },
  { id: 4, label: "Contact" },
  { id: 5, label: "Business details" },
  { id: 6, label: "Review & submit" },
] as const;

export function BusinessProgress({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted/70">
        Submission progress
      </p>
      <div className="relative">
        <div
          className="absolute left-[42px] top-1/2 h-[1px] w-full -translate-y-1/2 bg-line/50"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-4">
          {STEPS.map((step, index) => {
            const isComplete = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            return (
              <div
                key={step.id}
                className="flex items-center gap-3"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-all",
                    isComplete
                      ? "bg-forest-900 border-forest-900 text-ivory-50"
                      : isCurrent
                        ? "bg-coral-500 border-coral-500 text-ivory-50"
                        : "bg-white-warm border-line text-ink-muted",
                  )}
                >
                  {isComplete ? (
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    String(step.id)
                  )}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-semibold transition-colors",
                    isComplete
                      ? "text-forest-700"
                      : isCurrent
                        ? "text-coral-ink"
                        : "text-ink-muted",
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
