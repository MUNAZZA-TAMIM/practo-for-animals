"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CorrectionCTA() {
  return (
    <section className="section-pad" id="corrections">
      <div className="container-page">
        <div className="rounded-[20px] border border-line bg-white-warm p-8 sm:p-12">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="kicker">Help us improve</p>
              <h2 className="mt-2 text-[30px] leading-[1.05] tracking-[-0.04em] text-forest-900 sm:text-[36px]">
                Help us keep animal-care information accurate.
              </h2>
              <p className="mt-3 text-[13px] leading-6 text-ink-muted">
                Found incorrect information? Let us know so we can review it.
              </p>
            </div>
            <Link
              href="/submit-correction"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-forest-primary bg-forest-primary px-5 text-[13px] font-semibold text-ivory-warm transition-colors hover:bg-forest-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-accent sm:px-6"
            >
              Report Incorrect Information
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
