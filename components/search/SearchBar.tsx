"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  MapPin,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import {
  CITIES,
  PROVIDER_CATEGORIES,
  SPECIES,
} from "@/lib/data/providers";
import { cn } from "@/lib/utils";

const SERVICE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Services" },
  { value: "veterinary", label: "Veterinary Clinic" },
  { value: "emergency", label: "Animal Hospital" },
  { value: "diagnostics", label: "Diagnostics" },
  { value: "boarding", label: "Boarding" },
  { value: "ambulance", label: "Ambulance" },
  { value: "rescue", label: "NGO" },
  { value: "equine", label: "Farm Animal Care" },
] as const;

const ANIMAL_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Animals" },
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
  { value: "Bird", label: "Bird" },
  { value: "Rabbit", label: "Rabbit" },
  { value: "Horse", label: "Horse" },
  { value: "Cow", label: "Cow" },
  { value: "Goat", label: "Goat" },
  { value: "Other", label: "Other Animals" },
] as const;

const RESULTS_PER_PAGE = 6;

export function SearchBar({
  initialParams,
  defaultResults,
}: {
  initialParams: { q?: string; city?: string; type?: string; species?: string };
  defaultResults: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = React.useState(1);

  const q = initialParams.q ?? searchParams.get("q") ?? "";
  const city = initialParams.city ?? searchParams.get("city") ?? "";
  const type = initialParams.type ?? searchParams.get("type") ?? "";
  const species = initialParams.species ?? searchParams.get("species") ?? "";

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const params = new URLSearchParams();
      const location = String(formData.get("location") ?? "").trim();
      const service = String(formData.get("service") ?? "");
      const animal = String(formData.get("animal") ?? "");

      if (location) params.set("city", location);
      if (service) params.set("type", service);
      if (animal) params.set("species", animal);
      params.set("sort", "featured");
      params.delete("page");

      const query = params.toString();
      router.push(query ? `/find?${query}` : "/find", { scroll: false });
    },
    [router],
  );

  const handleLoadMore = React.useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  return (
    <>
      {/* Prominent search bar at top of results */}
      <form
        onSubmit={handleSubmit}
        className="relative rounded-[22px] border border-line bg-white-warm shadow-[0_24px_60px_-36px_rgba(13,43,35,0.4)] sm:p-4"
        role="search"
        aria-label="Search animal care providers"
      >
        <div className="grid gap-2 sm:grid-cols-[1.35fr_0.95fr_0.9fr_auto]">
          <div className="relative">
            <MapPin
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-600"
              aria-hidden="true"
            />
            <label htmlFor="search-location" className="sr-only">
              Enter city or location
            </label>
            <input
              id="search-location"
              name="location"
              type="search"
              placeholder="Enter city or location"
              defaultValue={city}
              autoComplete="off"
              spellCheck={false}
              className="h-13 w-full rounded-[14px] border border-transparent bg-ivory-warm/70 pl-11 pr-4 text-[14px] text-charcoal outline-none transition-colors placeholder:text-ink-muted/60 hover:bg-ivory-warm focus:border-forest-primary focus:bg-white-warm sm:text-[15px]"
            />
          </div>

          <div className="relative">
            <label htmlFor="search-service" className="sr-only">
              Choose a service category
            </label>
            <select
              id="search-service"
              name="service"
              defaultValue={type}
              className="h-13 w-full appearance-none rounded-[14px] border border-transparent bg-ivory-warm/70 pl-4 pr-10 text-[14px] text-charcoal outline-none transition-colors hover:bg-ivory-warm focus:border-forest-primary focus:bg-white-warm sm:text-[15px]"
            >
              {SERVICE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted"
              aria-hidden="true"
            />
          </div>

          <div className="relative">
            <label htmlFor="search-animal" className="sr-only">
              Choose an animal
            </label>
            <select
              id="search-animal"
              name="animal"
              defaultValue={species}
              className="h-13 w-full appearance-none rounded-[14px] border border-transparent bg-ivory-warm/70 pl-4 pr-10 text-[14px] text-charcoal outline-none transition-colors hover:bg-ivory-warm focus:border-forest-primary focus:bg-white-warm sm:text-[15px]"
            >
              {ANIMAL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted"
              aria-hidden="true"
            />
          </div>

          <Button type="submit" size="lg" className="h-13 px-7 sm:min-w-[132px]">
            Search Providers
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </form>

      {/* Load More control (shown below results via ProviderGrid) */}
    </>
  );
}

export { RESULTS_PER_PAGE };
