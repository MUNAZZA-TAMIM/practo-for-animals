import { Filter, RotateCcw, Search } from "lucide-react";
import {
  CITIES,
  PROVIDER_CATEGORIES,
  PROVIDER_FEATURES,
  SPECIES,
} from "@/lib/data/providers";
import type { DirectoryParams } from "@/lib/data/directory";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// All available services across the provider dataset (derived from provider data).
const ALL_SERVICES = [
  "Preventive check-ups",
  "Dental assessment",
  "Diagnostics & ultrasound",
  "Senior companion care",
  "Nutrition conversations",
  "Emergency triage",
  "Critical care",
  "Digital imaging",
  "Overnight observation",
  "Coat assessment",
  "Breed-specific trims",
  "Bath & blow-dry",
  "Nail care",
  "Puppy first groom",
  "Daycare",
  "Overnight boarding",
  "Enrichment sessions",
  "Pickup & drop",
  "Puppy foundations",
  "Reactivity support",
  "Separation-related behaviour plans",
  "Family handling sessions",
  "Home wellness visits",
  "Vaccination visits",
  "Senior mobility checks",
  "Sample collection",
  "Avian wellness",
  "Small mammal care",
  "Husbandry consultations",
  "Beak & nail care",
  "Lameness assessment",
  "Equine dental checks",
  "Preventive wellness",
  "Farrier coordination",
  "Cat-only consultations",
  "Senior cat care",
  "Behaviour conversations",
  "Rabbit wellness checks",
  "Dental health",
  "Nail & coat care",
  "Habitat advice",
  "Rescue coordination",
  "Foster network",
  "Adoption counselling",
  "Community feeding support",
  "Daily drop-in visits",
  "Overnight sitting",
  "Feeding routines",
  "Home safety check",
] as const;

export function FilterFields({
  params,
  idPrefix,
}: {
  params: DirectoryParams;
  idPrefix: string;
}) {
  return (
    <div className="space-y-6">
      <input type="hidden" name="sort" value={params.sort} />

      <Field label="Search" htmlFor={`${idPrefix}-q`}>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-600"
            aria-hidden="true"
          />
          <Input
            id={`${idPrefix}-q`}
            name="q"
            type="search"
            defaultValue={params.q}
            placeholder="Name, service or area"
            className="pl-10"
          />
        </div>
      </Field>

      <Field label="Care type" htmlFor={`${idPrefix}-type`}>
        <Select id={`${idPrefix}-type`} name="type" defaultValue={params.type}>
          <option value="">All care types</option>
          {PROVIDER_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="City" htmlFor={`${idPrefix}-city`}>
          <Select id={`${idPrefix}-city`} name="city" defaultValue={params.city}>
            <option value="">All cities</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Species" htmlFor={`${idPrefix}-species`}>
          <Select
            id={`${idPrefix}-species`}
            name="species"
            defaultValue={params.species}
          >
            <option value="">All species</option>
            {SPECIES.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Services offered" htmlFor={`${idPrefix}-services`}>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          {ALL_SERVICES.map((service) => {
            const isSelected = params.services.includes(service);
            return (
              <label
                key={service}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-[9px] border px-3 py-2 text-[12px] font-medium transition-colors",
                  isSelected
                    ? "border-forest-900/25 bg-mint-100 text-forest-900"
                    : "border-line bg-white-warm text-ink-muted hover:border-forest-900/20",
                )}
              >
                <input
                  type="checkbox"
                  name="service"
                  value={service}
                  defaultChecked={isSelected}
                  className="h-3.5 w-3.5 shrink-0 accent-forest-900"
                />
                {service}
              </label>
            );
          })}
        </div>
      </Field>

      <fieldset>
        <legend className="text-[13px] font-semibold leading-5 text-forest-900">
          Practical needs
        </legend>
        <div className="mt-2.5 space-y-2">
          <label
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-[9px] border px-3 py-2 text-[12px] font-medium transition-colors",
              !params.feature
                ? "border-forest-900/25 bg-mint-100 text-forest-900"
                : "border-line bg-white-warm text-ink-muted hover:border-forest-900/20",
            )}
          >
            <input
              type="radio"
              name="feature"
              value=""
              defaultChecked={!params.feature}
              className="h-3.5 w-3.5 accent-forest-900"
            />
            Any practical need
          </label>
          {PROVIDER_FEATURES.map((feature) => (
            <label
              key={feature.value}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-[9px] border px-3 py-2 text-[12px] font-medium transition-colors",
                params.feature === feature.value
                  ? "border-forest-900/25 bg-mint-100 text-forest-900"
                  : "border-line bg-white-warm text-ink-muted hover:border-forest-900/20",
              )}
            >
              <input
                type="radio"
                name="feature"
                value={feature.value}
                defaultChecked={params.feature === feature.value}
                className="h-3.5 w-3.5 accent-forest-900"
              />
              {feature.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex gap-2 border-t border-line pt-5">
        <Button type="submit" size="md" className="flex-1">
          <Filter className="h-4 w-4" aria-hidden="true" />
          Apply filters
        </Button>
        <Button asChild variant="secondary" size="icon" aria-label="Clear filters">
          <a href="/find">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </div>
  );
}
