"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Provider } from "@/lib/data/providers";

/**
 * Build a Google Maps directions URL from an address.
 * Uses the address query parameter so the user's preferred maps app opens.
 */
function buildDirectionsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function ProviderContactPanel({
  provider,
  variant = "default",
}: {
  provider: Provider;
  variant?: "default" | "compact" | "hero";
}) {
  const hasPhone = Boolean(provider.phone?.trim());
  const hasEmail = Boolean(provider.email?.trim());
  const hasWebsite = Boolean(provider.website?.trim());
  const hasAddress = Boolean(provider.address?.trim());

  const directionsUrl = hasAddress ? buildDirectionsUrl(provider.address) : null;
  const telUrl = hasPhone ? `tel:${provider.phone.replace(/\s/g, "")}` : null;
  const mailtoUrl = hasEmail ? `mailto:${provider.email}` : null;

  const baseClasses = "rounded-[20px] border border-line bg-white-warm";

  if (variant === "hero") {
    return (
      <section className={cn(baseClasses, "p-6 sm:p-8")}>
        <p className="kicker mb-3">Contact {provider.name}</p>
        <h2 className="font-display text-[30px] leading-[1.04] tracking-[-0.03em] text-forest-900 sm:text-[36px]">
          Get in touch
        </h2>
        <p className="mt-4 max-w-xl text-[14px] leading-7 text-ink-muted">
          Reach out to {provider.name} directly using the contact details below.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {hasPhone && telUrl ? (
            <Link
              href={telUrl}
              className="flex items-center gap-3 rounded-[16px] border border-line bg-white-warm px-5 py-4 transition-colors hover:border-forest-900/25 hover:bg-mint-50"
            >
              <Phone className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                  Call
                </p>
                <p className="mt-0.5 text-[13px] font-semibold leading-5 text-forest-900">
                  {provider.phone}
                </p>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
            </Link>
          ) : null}
          {hasEmail && mailtoUrl ? (
            <Link
              href={mailtoUrl}
              className="flex items-center gap-3 rounded-[16px] border border-line bg-white-warm px-5 py-4 transition-colors hover:border-forest-900/25 hover:bg-mint-50"
            >
              <Mail className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                  Email
                </p>
                <p className="mt-0.5 text-[13px] font-semibold leading-5 text-forest-900">
                  {provider.email}
                </p>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
            </Link>
          ) : null}
          {hasWebsite && provider.website ? (
            <Link
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-[16px] border border-line bg-white-warm px-5 py-4 transition-colors hover:border-forest-900/25 hover:bg-mint-50"
            >
              <ExternalLink className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                  Website
                </p>
                <p className="mt-0.5 text-[13px] font-semibold leading-5 text-forest-900 line-clamp-1">
                  {provider.website.replace(/^https?:\/\//, "")}
                </p>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
            </Link>
          ) : null}
          {directionsUrl ? (
            <Link
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-[16px] border border-line bg-white-warm px-5 py-4 transition-colors hover:border-forest-900/25 hover:bg-mint-50"
            >
              <MapPin className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                  Get directions
                </p>
                <p className="mt-0.5 text-[13px] font-semibold leading-5 text-forest-900 line-clamp-1">
                  Open in maps
                </p>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
            </Link>
          ) : null}
        </div>

        {!hasPhone && !hasEmail && !hasWebsite && !directionsUrl ? (
          <p className="mt-8 text-[13px] leading-6 text-ink-muted text-center">
            No contact details are available for this provider.
          </p>
        ) : null}
      </section>
    );
  }

  // Default variant: detailed contact card (sidebar)
  return (
    <section className={cn(baseClasses, "p-6")}>
      <p className="kicker mb-3">Contact</p>
      <h2 className="font-display text-[22px] leading-tight tracking-[-0.03em] text-forest-900 sm:text-[26px]">
        Contact {provider.name}
      </h2>

      <div className="mt-6 space-y-4">
        {hasPhone && telUrl ? (
          <div className="flex items-start gap-3">
            <Phone
              className="mt-0.5 h-4 w-4 shrink-0 text-forest-600"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                Phone
              </p>
              <Link
                href={telUrl}
                className="mt-0.5 block break-all text-[13px] font-semibold leading-5 text-forest-900 underline-offset-4 hover:underline"
              >
                {provider.phone}
              </Link>
            </div>
          </div>
        ) : null}

        {hasEmail && mailtoUrl ? (
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                Email
              </p>
              <Link
                href={mailtoUrl}
                className="mt-0.5 block break-all text-[13px] font-semibold leading-5 text-forest-900 underline-offset-4 hover:underline"
              >
                {provider.email}
              </Link>
            </div>
          </div>
        ) : null}

        {hasAddress ? (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                Address
              </p>
              <p className="mt-0.5 block break-all text-[13px] font-semibold leading-5 text-forest-900">
                {provider.address}
              </p>
              {directionsUrl ? (
                <Link
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-forest-800 underline-offset-4 hover:underline"
                >
                  Get directions
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        {hasWebsite && provider.website ? (
          <div className="flex items-start gap-3">
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                Website
              </p>
              <Link
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 block break-all text-[13px] font-semibold leading-5 text-forest-900 underline-offset-4 hover:underline"
              >
                {provider.website.replace(/^https?:\/\//, "")}
              </Link>
            </div>
          </div>
        ) : null}

        {!hasPhone && !hasEmail && !hasWebsite && !hasAddress ? (
          <p className="mt-2 text-[12px] leading-5 text-ink-muted text-center">
            No contact details are available for this provider.
          </p>
        ) : null}
      </div>
    </section>
  );
}
