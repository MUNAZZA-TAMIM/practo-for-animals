"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section className="section-pad bg-forest-950 text-ivory-50" id="cta">
      <div className="container-page relative overflow-hidden py-16 lg:py-24">
        <div
          className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full border border-ivory-50/10"
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="kicker text-mint-300">Ready to start?</p>
            <h2 className="mt-4 text-[44px] leading-[0.98] tracking-[-0.045em] text-ivory-50 sm:text-[56px] lg:text-[64px]">
              Better care begins with the right{" "}
              <span className="display-italic text-mint-300">connection.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[14px] leading-7 text-ivory-50/65">
              Find animal-care services that help you care for the animals you love.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/find"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-forest-primary bg-forest-primary px-6 text-[13px] font-semibold text-ivory-warm transition-colors hover:bg-forest-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-accent sm:px-7 sm:py-3"
            >
              Find Animal Care
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/content-studio"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-ivory-50/30 bg-ivory-50/10 px-6 text-[13px] font-semibold text-ivory-50 transition-colors hover:bg-ivory-50/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-accent sm:px-7 sm:py-3"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
