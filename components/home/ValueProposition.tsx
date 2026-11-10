"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ValueProposition = {
  title: string;
  body: string;
};

export const VALUE_PROPOSITIONS: ValueProposition[] = [
  {
    title: "Discover",
    body: "Explore animal-care providers across categories, species and cities — all in one considered directory.",
  },
  {
    title: "Compare",
    body: "Review provider information, services offered, hours and contact details before you make a call.",
  },
  {
    title: "Connect",
    body: "Reach out to providers using their available contact information. No booking maze between you and care.",
  },
] as const;

export function ValueProposition() {
  return (
    <section className="section-pad" id="value">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-14">
          <div className="max-w-2xl">
            <p className="kicker">What makes this different</p>
            <h2 className="mt-4 text-[40px] leading-[1.01] tracking-[-0.04em] text-forest-900 sm:text-[50px]">
              Finding the right care should feel simple.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-ink-muted">
              Discover animal-care services, compare available information and connect with providers that fit
              your needs.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {VALUE_PROPOSITIONS.map((item) => (
            <section
              key={item.title}
              className="rounded-[20px] border border-line bg-white-warm p-6 sm:p-8"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-900 text-ivory-50">
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase">
                  {item.title.charAt(0)}
                </span>
              </span>
              <h3 className="mt-6 font-display text-[24px] leading-none tracking-[-0.03em] text-forest-900 sm:text-[28px]">
                {item.title}
              </h3>
              <p className="mt-4 text-[14px] leading-7 text-ink-muted">
                {item.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-[22px] border border-line bg-ivory-50 p-8 sm:p-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted/70 mb-3">
            An honest directory
          </p>
          <p className="text-[14px] leading-7 text-ink-muted max-w-xl">
            Every listing on Practo for Animals is marked as sample data. We do not claim provider verification,
            ratings, testimonials or partnerships. A listing is a starting point, not an endorsement — for
            anything clinical, speak to a qualified professional and confirm details directly.
          </p>
        </div>
      </div>
    </section>
  );
}
