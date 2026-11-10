"use client";

import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const POPULAR_LOCATIONS = [
  "Bengaluru",
  "Mumbai",
  "Pune",
  "Delhi NCR",
  "Hyderabad",
  "Chennai",
] as const;

export function LocationDiscovery() {
  return (
    <section className="section-pad border-t border-line/70 bg-ivory-50" id="locations">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-14">
          <div className="max-w-2xl">
            <p className="kicker">Find care near you</p>
            <h2 className="mt-4 text-[40px] leading-[1.01] tracking-[-0.04em] text-forest-900 sm:text-[50px]">
              Find animal care near you.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-ink-muted">
              Discover services in your city or preferred location. Enter a location manually — we do not
              access your precise location without your permission.
            </p>
          </div>
        </div>

        <div className="rounded-[20px] border border-line bg-white-warm p-6 sm:p-8 shadow-card">
          <form
            action="/find"
            method="get"
            className="relative mb-8 sm:mb-10"
            role="search"
            aria-label="Search by location"
          >
            <MapPin
              className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-600"
              aria-hidden="true"
            />
            <label htmlFor="location-search" className="sr-only">
              Enter your city or area
            </label>
            <input
              id="location-search"
              name="city"
              type="search"
              placeholder="Enter your city or area"
              autoComplete="off"
              spellCheck={false}
              className="h-13 w-full rounded-[14px] border border-transparent bg-ivory-warm/70 pl-11 pr-4 text-[14px] text-charcoal outline-none transition-colors placeholder:text-ink-muted/60 hover:bg-ivory-warm focus:border-forest-primary focus:bg-white-warm focus:ring-0 sm:text-[15px]"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-full border border-forest-primary bg-forest-primary px-4 py-2.5 text-[13px] font-semibold text-ivory-warm transition-colors hover:bg-forest-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-accent sm:px-6 sm:py-3"
            >
              Search
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </form>

          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted/70 mb-4">
            Popular locations
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_LOCATIONS.map((city) => {
              const href = `/find?city=${encodeURIComponent(city)}`;
              return (
                <Link
                  key={city}
                  href={href}
                  className="rounded-full border border-line bg-white-warm px-3.5 py-1.5 text-[11px] font-semibold text-forest-800 transition-colors hover:border-forest-900/25 hover:bg-mint-50"
                >
                  {city}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
