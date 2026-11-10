"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CareCategory = {
  value: string;
  label: string;
  description: string;
  image: string;
  imageAlt: string;
  searchParam: string;
};

export const CARE_CATEGORIES: CareCategory[] = [
  {
    value: "veterinary",
    label: "Veterinary Clinics",
    description: "Check-ups, diagnostics, dentistry and ongoing care.",
    image: "/images/vet-care.jpg",
    imageAlt: "Veterinarian examining a German Shepherd in a clinic",
    searchParam: "veterinary",
  },
  {
    value: "emergency",
    label: "Animal Hospitals",
    description: "Urgent help when your companion needs it now.",
    image: "/images/vet-xray.jpg",
    imageAlt: "Veterinarian reviewing a digital X-ray of a dog",
    searchParam: "emergency",
  },
  {
    value: "diagnostics",
    label: "Diagnostics",
    description: "Imaging, lab tests and screening services.",
    image: "/images/vet-xray.jpg",
    imageAlt: "Veterinary diagnostic equipment in a clinic",
    searchParam: "veterinary",
  },
  {
    value: "boarding",
    label: "Boarding & Pet Care",
    description: "Daycare, overnight stays and enrichment.",
    image: "/images/dog-run.jpg",
    imageAlt: "Two happy dogs running towards the camera at golden hour",
    searchParam: "boarding",
  },
  {
    value: "mobile",
    label: "Animal Ambulances",
    description: "Care that comes to your home, at your pace.",
    image: "/images/vet-portrait.jpg",
    imageAlt: "Veterinarian carefully holding a small orange Pomeranian",
    searchParam: "mobile",
  },
  {
    value: "rescue",
    label: "NGOs & Animal Welfare",
    description: "Trusts and networks supporting animals in need.",
    image: "/images/cat-high-five.jpg",
    imageAlt: "Kitten reaching a paw upward against a soft mint backdrop",
    searchParam: "rescue",
  },
  {
    value: "equine",
    label: "Farm Animal Care",
    description: "Preventive and rehabilitative care for horses.",
    image: "/images/horse.jpg",
    imageAlt: "White horse cantering through a dark green meadow",
    searchParam: "equine",
  },
  {
    value: "training",
    label: "Other Animal Services",
    description: "Training, grooming and specialist support.",
    image: "/images/dog-portrait.jpg",
    imageAlt: "Golden retriever looking directly at the camera after a swim",
    searchParam: "training",
  },
] as const;

export function AnimalCareCategories() {
  return (
    <section className="section-pad border-t border-line/70 bg-ivory-50" id="categories">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl">
            <p className="kicker">Explore animal care</p>
            <h2 className="mt-4 text-[40px] leading-[1.01] tracking-[-0.04em] text-forest-900 sm:text-[50px]">
              Care for every kind of{" "}
              <span className="display-italic text-forest-700">animal.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-ink-muted">
              Find the right services for the animals that depend on you.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
          {CARE_CATEGORIES.map((category) => {
            const href = `/find?category=${encodeURIComponent(category.searchParam)}`;
            return (
              <Link
                key={category.value}
                href={href}
                className="group relative block overflow-hidden rounded-[20px] border border-line bg-white-warm card-lift"
                aria-label={`Browse ${category.label} providers`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ivory-100">
                  <Image
                    src={category.image}
                    alt={category.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 via-transparent to-transparent" />
                  <div className="absolute inset-x-4 bottom-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white-warm/80 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-forest-900">
                      {category.label}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="font-display text-[22px] leading-none tracking-[-0.025em] text-forest-900 group-hover:text-forest-700 transition-colors">
                    {category.label}
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-[12.5px] leading-5 text-ink-muted">
                    {category.description}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-[11px] font-bold text-forest-800">
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-line pt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted/70">
            Need a specific service?
          </p>
          <Link
            href="/find"
            className="inline-flex items-center gap-2 text-[11px] font-bold text-forest-900 link-underline"
          >
            Browse the full directory
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
