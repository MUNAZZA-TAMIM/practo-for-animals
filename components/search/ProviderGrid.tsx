"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProviderSkeleton({ priority = false }: { priority?: boolean } = {}) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-line/90 bg-white-warm animate-pulse",
        priority ? "border-forest-900/20" : "",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ivory-100">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/10 to-transparent p-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white-warm/80 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-forest-900 animate-pulse">
            Sample listing
          </span>
          <span className="rounded-full bg-forest-950/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ivory-50 backdrop-blur-sm animate-pulse">
            Veterinary care
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-[60%] bg-ivory-200 rounded animate-pulse" />
            <div className="h-4 w-[40%] bg-ivory-200/60 rounded animate-pulse" />
          </div>
          <div className="h-9 w-9 rounded-full bg-ivory-200 animate-pulse" />
        </div>

        <div className="mt-4 h-4 w-3/4 bg-ivory-200/60 rounded animate-pulse" />
        <div className="mt-2 h-4 w-1/2 bg-ivory-200/40 rounded animate-pulse" />

        <div className="mt-5 flex flex-wrap gap-1.5">
          {[1, 2].map((i) => (
            <span
              key={i}
              className="rounded-full border border-line/80 bg-ivory-50 px-2.5 py-1 text-[10.5px] font-semibold text-forest-800 animate-pulse"
            >
              Service
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5 border-t border-line/80 pt-4 space-y-3">
          <div className="flex items-center gap-2 h-6">
            <div className="h-3.5 w-16 rounded-full bg-ivory-200 animate-pulse" />
            <div className="h-3.5 w-1/3 rounded-full bg-ivory-200/60 animate-pulse" />
          </div>

          <div className="grid gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="w-full text-[12px] font-semibold text-ink-muted/25"
            >
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              View Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="w-full text-[12px] font-semibold text-ink-muted/25"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              Contact Provider
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function SearchSkeletonGrid({ count = 6 }: { count?: number } = {}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProviderSkeleton key={index} priority={index < 2} />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  icon,
  className,
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-dashed border-line bg-ivory-100/60 px-8 py-16 text-center",
        className,
      )}
    >
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white-warm text-forest-600">
        {icon}
      </span>
      <h3 className="mt-5 font-display text-[28px] leading-tight text-forest-900">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-[13px] leading-6 text-ink-muted">
        {description}
      </p>
      {ctaLabel && ctaHref ? (
        <Button asChild className="mt-6" variant="secondary">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
