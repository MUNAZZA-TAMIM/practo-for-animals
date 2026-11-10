"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Provider } from "@/lib/data/providers";
import { cn } from "@/lib/utils";

export function ProviderGallery({
  provider,
  className,
}: {
  provider: Provider;
  className?: string;
}) {
  const hasImage = Boolean(provider.image?.trim());

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[22px] bg-mint-100",
        className,
      )}
    >
      {hasImage ? (
        <>
          <Image
            src={provider.image}
            alt={provider.imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-forest-950/35 to-transparent p-4">
            <Badge variant="sample" className="bg-ivory-50/92 text-amber-ink backdrop-blur-sm">
              Sample listing
            </Badge>
            <span className="rounded-full bg-forest-950/60 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.13em] text-ivory-50 backdrop-blur-sm">
              {provider.category.charAt(0).toUpperCase() + provider.category.slice(1)}
            </span>
          </div>
          <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/20 bg-ivory-50/92 p-3 backdrop-blur-md">
            <p className="text-[10.5px] leading-4 text-amber-ink">
              Photography used illustratively — not necessarily the pictured provider.
            </p>
          </div>
        </>
      ) : (
        <div className="relative aspect-[4/3] flex items-center justify-center bg-ivory-100">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-forest-900 text-ivory-50">
            <span className="h-6 w-6" />
          </span>
          <p className="mt-4 text-[11px] font-semibold text-ink-muted text-center">
            No provider image available
          </p>
        </div>
      )}
    </div>
  );
}
