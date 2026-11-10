"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Ambulance,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  LocateFixed,
  MapPin,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Specialities & Services" },
  { value: "veterinary-clinic", label: "Veterinary Clinic" },
  { value: "animal-hospital", label: "Animal Hospital" },
  { value: "diagnostics", label: "Diagnostics & Labs" },
  { value: "boarding", label: "Boarding & Daycare" },
  { value: "ambulance", label: "Ambulance & Triage" },
  { value: "ngo", label: "NGO & Wildlife Rescue" },
  { value: "farm-animal-care", label: "Farm & Equine Herd Care" },
];

const SPECIES_ITEMS = [
  {
    id: "canines",
    name: "Canines",
    filterValue: "Dog",
    image: "/images/species-canines.png",
  },
  {
    id: "felines",
    name: "Felines",
    filterValue: "Cat",
    image: "/images/species-felines.png",
  },
  {
    id: "avian",
    name: "Avian",
    filterValue: "Bird",
    image: "/images/species-avian.png",
  },
  {
    id: "lagomorphs",
    name: "Lagomorphs",
    filterValue: "Rabbit",
    image: "/images/species-lagomorphs.png",
  },
  {
    id: "equine",
    name: "Equine",
    filterValue: "Equine",
    image: "/images/species-equine.png",
  },
  {
    id: "livestock",
    name: "Livestock",
    filterValue: "Livestock",
    image: "/images/species-livestock.png",
  },
  {
    id: "exotics",
    name: "Exotics",
    filterValue: "Exotic",
    image: "/images/species-exotics.png",
  },
] as const;

export function AnimalCareHero() {
  const router = useRouter();
  const [location, setLocation] = React.useState("Koramangala, Bengaluru or City");
  const [service, setService] = React.useState("all");
  const [selectedSpecies, setSelectedSpecies] = React.useState<string>("canines");
  const [isLocating, setIsLocating] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted in some browser settings
      });
    }
  }, []);

  const handleLocateMe = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLocating(true);
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocation("Bengaluru, Karnataka");
          setIsLocating(false);
        },
        () => {
          setLocation("Koramangala, Bengaluru");
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setLocation("Koramangala, Bengaluru");
      setIsLocating(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location && location !== "Koramangala, Bengaluru or City") {
      params.set("city", location);
    }
    if (service && service !== "all") {
      params.set("type", service);
    }
    const currentSpeciesObj = SPECIES_ITEMS.find((s) => s.id === selectedSpecies);
    if (currentSpeciesObj) {
      params.set("species", currentSpeciesObj.filterValue);
    }
    router.push(`/find?${params.toString()}`);
  };

  return (
    <section
      className="relative min-h-[680px] sm:min-h-[740px] lg:min-h-[820px] w-full overflow-hidden flex flex-col justify-center pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 bg-black"
      aria-label="Animal care discovery"
    >
      {/* Background media: 100% pure real video color - NO color overlay so video is crystal clear */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover object-center"
          aria-hidden="true"
        >
          <source src="/videos/animal-care-hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content layer */}
      <div className="container-page relative z-10 flex flex-col items-center text-center">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 animate-fade">
          {/* Badge 1: Accredited Clinical Network */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/55 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-md backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span>Accredited Clinical Network</span>
          </div>

          {/* Badge 2: 14,200+ Verified Vets & Hospitals */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/55 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-md backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>
              <strong className="font-bold text-white">14,200+</strong> Verified Vets &amp; Hospitals
            </span>
          </div>

          {/* Badge 3: 24/7 Rapid Triage */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-black/55 px-3.5 py-1.5 text-[12px] font-semibold text-amber-200 shadow-md backdrop-blur-md">
            <Ambulance className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <span>24/7 Rapid Triage</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="max-w-4xl text-[38px] leading-[1.08] tracking-[-0.035em] text-white sm:text-[54px] md:text-[66px] lg:text-[76px] font-extrabold animate-rise drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          Better care for{" "}
          <span className="relative inline-block text-emerald-300 font-serif italic font-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            every animal
            {/* Golden-yellow wavy squiggle underline */}
            <svg
              className="absolute -bottom-1.5 left-0 w-full h-2.5 sm:h-3 text-amber-400 overflow-visible pointer-events-none"
              viewBox="0 0 120 8"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,4 Q5,0 10,4 T20,4 T30,4 T40,4 T50,4 T60,4 T70,4 T80,4 T90,4 T100,4 T110,4 T120,4"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          starts here.
        </h1>

        {/* Subtitle */}
        <p className="mt-5 sm:mt-6 max-w-2xl text-[15px] sm:text-[17px] leading-relaxed text-white font-semibold animate-fade drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          From beloved domestic companions to farm and equine herds, instantly discover accredited
          veterinary clinics, ICUs, and mobile specialists near you.
        </p>

        {/* Unified Search Card */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative mt-8 sm:mt-10 w-full max-w-3xl lg:max-w-4xl rounded-2xl sm:rounded-3xl border border-white/20 bg-white/95 p-2 sm:p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-md animate-rise"
          role="search"
          aria-label="Find animal care providers"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[1.25fr_auto_1.25fr_auto] items-center gap-2 sm:gap-3">
            {/* Location Input */}
            <div className="flex items-center gap-3 px-3 py-2 sm:py-2.5">
              <MapPin className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <div className="flex-1 text-left">
                <label
                  htmlFor="hero-location-input"
                  className="block text-[9.5px] font-bold uppercase tracking-wider text-stone-400"
                >
                  LOCATION
                </label>
                <input
                  id="hero-location-input"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Koramangala, Bengaluru or City"
                  className="w-full bg-transparent text-[14px] sm:text-[15px] font-semibold text-stone-900 outline-none placeholder:text-stone-400"
                />
              </div>
              <button
                type="button"
                onClick={handleLocateMe}
                title="Locate me"
                aria-label="Use current location"
                className={cn(
                  "p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors",
                  isLocating && "animate-spin text-emerald-700"
                )}
              >
                <LocateFixed className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Vertical Divider */}
            <div className="hidden sm:block h-9 w-px bg-stone-200" aria-hidden="true" />

            {/* Discipline Dropdown */}
            <div className="flex items-center gap-3 px-3 py-2 sm:py-2.5">
              <Stethoscope className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <div className="flex-1 text-left">
                <label
                  htmlFor="hero-service-select"
                  className="block text-[9.5px] font-bold uppercase tracking-wider text-stone-400"
                >
                  DISCIPLINE
                </label>
                <div className="relative">
                  <select
                    id="hero-service-select"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full appearance-none bg-transparent pr-6 text-[14px] sm:text-[15px] font-semibold text-stone-900 outline-none cursor-pointer"
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#103a2f] hover:bg-[#0b2820] text-white px-6 sm:px-7 py-3.5 sm:py-4 font-bold text-[14px] sm:text-[15px] shadow-sm transition-transform active:scale-[0.98] w-full sm:w-auto"
            >
              <span>Find Providers</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </form>

        {/* Trust Indicators */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[12px] sm:text-[13px] font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 drop-shadow-sm" aria-hidden="true" />
            Free instant search
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 drop-shadow-sm" aria-hidden="true" />
            100% verified credentials
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 drop-shadow-sm" aria-hidden="true" />
            Direct hospital contact lines
          </span>
        </div>

        {/* Species Selector Row */}
        <div className="mt-10 sm:mt-12 w-full max-w-4xl">
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-white uppercase text-center mb-4 sm:mb-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            SELECT YOUR COMPANION OR HERD SPECIES
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-7">
            {SPECIES_ITEMS.map((item) => {
              const isSelected = selectedSpecies === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedSpecies(item.id)}
                  className="group flex flex-col items-center gap-1.5 focus-visible:outline-hidden"
                >
                  <div
                    className={cn(
                      "relative h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white/80 bg-white transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl",
                      isSelected && "ring-2 ring-emerald-400 ring-offset-2 ring-offset-black"
                    )}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[11px] sm:text-[12px] font-bold transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]",
                      isSelected
                        ? "text-emerald-300"
                        : "text-white group-hover:text-emerald-200"
                    )}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
