"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function BusinessListingIntro() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-ivory-100">
        <div
          className="pointer-events-none absolute -right-52 -top-40 h-[36rem] w-[36rem] rounded-full border border-forest-900/[0.06]"
          aria-hidden="true"
        />
        <div className="container-page relative py-8 sm:py-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="forest">Provider intake</Badge>
                <Badge variant="outline">
                  Human review first
                </Badge>
              </div>
              <h1 className="mt-5 text-[42px] leading-[0.98] tracking-[-0.045em] text-forest-900 sm:text-[54px] lg:text-[62px]">
                Make your animal-care services easier to{" "}
                <span className="display-italic text-coral-600">find.</span>
              </h1>
              <p className="mt-5 max-w-xl text-[14.5px] leading-7 text-ink-muted">
                Create a business listing and help animal owners find the
                services you provide. Every submission enters a founder review
                queue before anything is prepared for publication.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <Button asChild size="lg" className="w-full sm:w-auto justify-between px-6 py-3">
                  <Link href="#business-form">
                    List Your Business
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <p className="flex items-center gap-2 text-[10.5px] leading-4 text-ink-muted">
                  <span className="h-1 w-1 rounded-full bg-forest-900" aria-hidden="true" />
                  No marketing email will be sent.
                </p>
              </div>

              <div className="mt-8 rounded-[18px] border border-line bg-white-warm p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-muted/70">
                  A listing can include
                </p>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Services and species handled",
                    "Opening hours and practical facilities",
                    "Area, address and contact details",
                    "A considered description in your own words",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[12px] leading-5 text-forest-800"
                    >
                      <PawPrint
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[22px] bg-mint-100 shadow-[0_30px_70px_-45px_rgba(13,43,35,0.45)]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/vet-care.jpg"
                  alt="Veterinarian examining a German Shepherd with a stethoscope"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
                <div className="absolute left-3 top-3">
                  <Badge variant="ghostInverse">Provider intake</Badge>
                </div>
                <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-xl border border-white/20 bg-ivory-50/92 p-3 backdrop-blur-md">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-900 text-ivory-50">
                    <PawPrint className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-forest-900">
                      Human review first
                    </p>
                    <p className="mt-0.5 text-[9.5px] text-ink-muted">
                      No automatic publishing · No verification claim
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[9.5px] leading-4 text-ink-muted/70">
                Photography via Unsplash or Pexels. Used illustratively.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
