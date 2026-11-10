import { ArrowRight, MapPin, Search } from "lucide-react";
import { CITIES, PROVIDER_CATEGORIES } from "@/lib/data/providers";
import { Button } from "@/components/ui/button";

export function HeroSearch() {
  return (
    <form
      action="/find"
      method="get"
      className="relative rounded-[22px] border border-line bg-white-warm p-3 shadow-[0_24px_60px_-36px_rgba(13,43,35,0.4)] sm:p-4"
      role="search"
      aria-label="Search animal care"
    >
      <div className="grid gap-2 sm:grid-cols-[1.2fr_0.8fr_auto]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-600"
            aria-hidden="true"
          />
          <label htmlFor="hero-search-query" className="sr-only">
            What are you looking for?
          </label>
          <input
            id="hero-search-query"
            name="q"
            type="search"
            placeholder="Vet, hospital, boarding…"
            autoComplete="off"
            className="h-13 w-full rounded-[14px] border border-transparent bg-ivory-100/70 pl-11 pr-4 text-[14.5px] text-charcoal outline-none transition-colors placeholder:text-ink-muted/60 hover:bg-ivory-100 focus:border-forest-700 focus:bg-white-warm"
          />
        </div>
        <div className="relative">
          <MapPin
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-600"
            aria-hidden="true"
          />
          <label htmlFor="hero-search-city" className="sr-only">
            City
          </label>
          <select
            id="hero-search-city"
            name="city"
            className="h-13 w-full appearance-none rounded-[14px] border border-transparent bg-ivory-100/70 pl-11 pr-9 text-[14.5px] text-charcoal outline-none transition-colors hover:bg-ivory-100 focus:border-forest-700 focus:bg-white-warm"
            defaultValue=""
          >
            <option value="">Anywhere in India</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-ink-muted"
            aria-hidden="true"
          >
            ▾
          </span>
        </div>
        <Button type="submit" size="lg" className="h-13 px-6 sm:min-w-[124px]">
          Search
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 px-1 pb-0.5 text-[11.5px]">
        <span className="font-semibold text-ink-muted/75">Popular:</span>
        {["veterinary", "emergency", "boarding"].map((value) => {
          const category = PROVIDER_CATEGORIES.find((item) => item.value === value);
          return (
            <a
              key={value}
              href={`/find?type=${value}`}
              className="rounded-full px-2 py-1 font-semibold text-forest-800 transition-colors hover:bg-mint-100"
            >
              {category?.shortLabel}
            </a>
          );
        })}
        <a
          href="/find?feature=home-visits"
          className="rounded-full px-2 py-1 font-semibold text-forest-800 transition-colors hover:bg-mint-100"
        >
          Home visits
        </a>
      </div>
    </form>
  );
}
