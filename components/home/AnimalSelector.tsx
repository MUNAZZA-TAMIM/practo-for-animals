"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type AnimalOption = {
  value: string;
  label: string;
  image: string;
  imageAlt: string;
};

export const ANIMAL_OPTIONS: AnimalOption[] = [
  { value: "dog", label: "Dogs", image: "/images/dog-portrait.jpg", imageAlt: "Golden retriever looking directly at the camera after a swim" },
  { value: "cat", label: "Cats", image: "/images/cat.jpg", imageAlt: "Black and white cat resting its paws on a bamboo rail" },
  { value: "bird", label: "Birds", image: "/images/parrot.jpg", imageAlt: "Bright green parrot perched on a branch in soft forest light" },
  { value: "rabbit", label: "Rabbits", image: "/images/rabbit.jpg", imageAlt: "White rabbit sitting in a green garden" },
  { value: "horse", label: "Horses", image: "/images/horse.jpg", imageAlt: "White horse cantering through a dark green meadow" },
  { value: "cow", label: "Cows", image: "/images/horse.jpg", imageAlt: "Farm animal in a green pasture" },
  { value: "goat", label: "Goats", image: "/images/rabbit.jpg", imageAlt: "Small companion animal in a garden setting" },
  { value: "other", label: "Other Animals", image: "/images/cat-high-five.jpg", imageAlt: "Kitten reaching a paw upward against a soft mint backdrop" },
] as const;

export function AnimalSelector() {
  return (
    <section className="section-pad" id="animals">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-14">
          <div className="max-w-2xl">
            <p className="kicker">Who needs care?</p>
            <h2 className="mt-4 text-[40px] leading-[1.01] tracking-[-0.04em] text-forest-900 sm:text-[50px]">
              Who are you finding care for?
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-ink-muted">
              Browse providers by the species they care for. This helps you narrow your search before you
              compare individual listings.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4 lg:grid-cols-8 xl:gap-6">
          {ANIMAL_OPTIONS.map((animal) => {
            const href = `/find?species=${encodeURIComponent(animal.value)}`;
            return (
              <Link
                key={animal.value}
                href={href}
                className="group block overflow-hidden rounded-[20px] border border-line bg-white-warm card-lift"
                aria-label={`Find care for ${animal.label}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ivory-100">
                  <Image
                    src={animal.image}
                    alt={animal.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 12vw"
                    className="object-cover transition-transform duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 via-transparent to-transparent" />
                  <div className="absolute inset-x-4 bottom-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white-warm/80 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-forest-900">
                      {animal.label}
                    </span>
                  </div>
                </div>
                <div className="absolute -inset-px z-20 rounded-[20px] outline-none ring-2 ring-transparent focus-visible:ring-coral-500" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
