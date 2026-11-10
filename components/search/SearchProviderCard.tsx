"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getCategoryLabel,
  type Provider,
} from "@/lib/data/providers";
import { cn } from "@/lib/utils";

export function SearchProviderCard({
  provider,
  className,
  priority = false,
}: {
  provider: Provider;
  className?: string;
  priority?: boolean;
}) {
  const hasPhone = Boolean(provider.phone && provider.phone.trim().length > 0);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-line/90 bg-white-warm card-lift",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-mint-100">
        <Link
          href={`/providers/${provider.slug}`}
          className="block"
          aria-label={`View ${provider.name} details`}
        >
          <Image
            src={provider.image}
            alt={provider.imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-forest-950/35 to-transparent p-4">
            <Badge variant="sample" className="bg-ivory-50/92 text-amber-ink backdrop-blur-sm">
              Sample listing
            </Badge>
            <span className="rounded-full bg-forest-950/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ivory-50 backdrop-blur-sm">
              {getCategoryLabel(provider.category)}
            </span>
          </div>
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-[25px] leading-[1.08] tracking-[-0.03em] text-forest-900">
              <Link
                href={`/providers/${provider.slug}`}
                className="rounded-sm transition-colors hover:text-forest-700"
              >
                {provider.name}
              </Link>
            </h3>
            <p className="mt-2 flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
              {provider.area}, {provider.city}
            </p>
          </div>
          <Link
            href={`/providers/${provider.slug}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-forest-700 transition-all duration-300 group-hover:border-forest-800 group-hover:bg-forest-900 group-hover:text-ivory-50"
            aria-label={`View ${provider.name} details`}
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-4 line-clamp-2 text-[13.5px] leading-6 text-ink-muted">
          {provider.about}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {provider.services.slice(0, 2).map((service) => (
            <span
              key={service}
              className="rounded-full border border-line/80 bg-ivory-50 px-2.5 py-1 text-[10.5px] font-semibold text-forest-800"
            >
              {service}
            </span>
          ))}
          {provider.services.length > 2 ? (
            <span className="rounded-full px-1.5 py-1 text-[10.5px] font-semibold text-ink-muted">
              +{provider.services.length - 2}
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-5 border-t border-line/80 pt-4 space-y-3">
          <div className="flex items-center gap-2 text-[11.5px] leading-5 text-ink-muted">
            <Clock3 className="h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
            <span>{provider.hours}</span>
          </div>

          <div className="grid gap-2">
            <Link
              href={`/providers/${provider.slug}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-forest-primary bg-forest-primary px-4 py-2.5 text-[12px] font-semibold text-ivory-warm transition-colors hover:bg-forest-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-accent sm:px-5 sm:py-3"
            >
              View Details
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>

            {hasPhone ? (
              <Link
                href={`tel:${provider.phone.replace(/\s/g, "")}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white-warm px-4 py-2.5 text-[12px] font-semibold text-forest-900 transition-colors hover:border-forest-900/25 hover:bg-mint-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-accent sm:px-5 sm:py-3"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                Contact Provider
              </Link>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="w-full text-[12px] font-semibold text-ink-muted/50"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                Contact Provider
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
