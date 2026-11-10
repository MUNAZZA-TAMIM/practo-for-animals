"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProviderCTA() {
  return (
    <section className="section-pad" id="providers">
      <div className="container-page">
        <div className="grid gap-8 items-center lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <p className="kicker text-coral-ink">For animal-care businesses</p>
            <h2 className="mt-4 text-[40px] leading-[1.02] tracking-[-0.04em] text-forest-900 sm:text-[48px] lg:text-[56px]">
              Make your animal-care services easier to{" "}
              <span className="display-italic text-coral-600">discover.</span>
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-ink-muted">
              Help animal owners find your services and connect with your business. Present your services,
              location and contact information clearly so people can reach you with confidence.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Improve discoverability for local animal owners.",
                "Present your services, species and facilities clearly.",
                "Share location, hours and contact information.",
                "Help people understand your practice before they call.",
                "Keep your business information up to date.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] leading-6 text-forest-800">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest-900 text-ivory-50">
                    <span className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/list-business"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-forest-primary bg-forest-primary px-6 text-[13px] font-semibold text-ivory-warm transition-colors hover:bg-forest-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-accent"
              >
                List Your Business
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/list-business#what-happens-next"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-forest-primary/25 bg-white-warm px-6 text-[13px] font-semibold text-forest-900 transition-colors hover:bg-forest-primary/5 hover:text-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-accent"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative min-h-[400px] overflow-hidden rounded-[26px] border border-line bg-mint-100">
            <Image
              src="/images/vet-pomeranian.jpg"
              alt="Veterinarian carefully holding a small Pomeranian in a clinic"
              fill
              sizes="(max-width: 768px) 100vw, 46vw"
              className="object-cover object-[50%_35%]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent" />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-ivory-50/92 p-4 backdrop-blur-md sm:inset-x-7 sm:bottom-7">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-900 text-ivory-50">
                  <span className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted/70">
                    Provider profile preview
                  </p>
                  <p className="mt-0.5 text-[13px] font-bold text-forest-900">
                    Your practice, considered.
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-line bg-white-warm px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-amber-ink">
                Draft
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
