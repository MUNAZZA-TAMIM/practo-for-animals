"use client";

import { cn } from "@/lib/utils";

export function ProviderSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 animate-pulse",
        className,
      )}
    >
      {/* Hero image skeleton */}
      <div
        className={cn(
          "aspect-[4/3] rounded-[22px] bg-ivory-100 overflow-hidden relative",
        )}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#f6f0e3_25%,#ece2d1_50%,#f6f0e3_75%)] bg-[length:200%_100%] animate-[pulse_2s_infinite]" />
      </div>

      {/* Name skeleton */}
      <div className="h-8 w-[60%] bg-ivory-200 rounded" />

      {/* Category badge skeleton */}
      <div className="h-8 w-24 rounded-full bg-ivory-200" />

      {/* Location skeleton */}
      <div className="h-5 w-[40%] bg-ivory-200 rounded" />

      {/* Description skeleton */}
      <div className="h-5 w-full bg-ivory-200 rounded" />
      <div className="h-5 w-[70%] bg-ivory-200/60 rounded mt-2" />

      {/* Info grid skeletons */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-16 rounded-[18px] bg-ivory-200" />
        <div className="h-16 rounded-[18px] bg-ivory-200" />
        <div className="h-16 rounded-[18px] bg-ivory-200" />
      </div>

      {/* Contact panel skeleton */}
      <div className="h-64 rounded-[20px] bg-ivory-100 border border-line" />
    </div>
  );
}

export function ProviderSkeletonInline({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 animate-pulse", className)}>
      <div className="h-10 w-[50%] bg-ivory-200 rounded" />
      <div className="h-5 w-full bg-ivory-200 rounded" />
      <div className="h-5 w-[60%] bg-ivory-200/60 rounded mt-1" />
    </div>
  );
}
