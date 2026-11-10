"use client";

import * as React from "react";
import { Field } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ServicesAnimalsStepProps = {
  data: {
    services: string[];
    animalsSupported: string[];
  };
  updateField: <K extends keyof {
    services: string[];
    animalsSupported: string[];
  }>(
    key: K,
    value: {
      services: string[];
      animalsSupported: string[];
    }[K],
  ) => void;
};

const SERVICES = [
  "General Consultation",
  "Vaccination",
  "Surgery",
  "Diagnostics",
  "Emergency Care",
  "Dental Care",
  "Grooming",
  "Boarding",
  "Farm Animal Treatment",
  "Animal Ambulance",
] as const;

const ANIMALS = [
  "Dogs",
  "Cats",
  "Birds",
  "Rabbits",
  "Horses",
  "Cows",
  "Goats",
  "Other Animals",
] as const;

export function ServicesAnimalsStep({
  data,
  updateField,
}: ServicesAnimalsStepProps) {
  const toggleSelection = (key: "services" | "animalsSupported", value: string) => {
    const currentValues = data[key];
    if (currentValues.includes(value)) {
      updateField(key, currentValues.filter((item: string) => item !== value));
    } else {
      updateField(key, [...currentValues, value]);
    }
  };

  return (
    <section>
      <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
          02
        </span>
        <div>
          <h2 className="font-sans text-[16px] font-bold text-forest-900">
            Services & animals
          </h2>
          <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
            Select the services you offer and the animals you care for.
          </p>
        </div>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <Field label="Services offered" htmlFor="services-offered">
            <p className="text-[11px] leading-5 text-ink-muted mb-3">
              Select all that apply. These help animal owners understand what
              you provide.
            </p>
            <div className="grid gap-2">
              {SERVICES.map((service) => {
                const selected = data.services.includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => updateField("services", toggleArray(data.services, service))}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-[10px] border px-3.5 py-3 text-left text-[13.5px] font-semibold transition-all",
                      selected
                        ? "border-forest-900 bg-mint-100 text-forest-900"
                        : "border-line bg-white-warm text-ink-muted hover:border-forest-900/25 hover:bg-mint-50",
                    )}
                  >
                    <span>{service}</span>
                    {selected ? (
                      <span className="h-3.5 w-3.5 rounded-full bg-forest-900">
                        <span className="h-2 w-2 rounded-full bg-ivory-50" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        <div>
          <Field label="Animals supported" htmlFor="animals-supported">
            <p className="text-[11px] leading-5 text-ink-muted mb-3">
              Select the species you care for. This helps animal owners find
              the right provider for their companion.
            </p>
            <div className="grid gap-2">
              {ANIMALS.map((animal) => {
                const selected = data.animalsSupported.includes(animal);
                return (
                  <button
                    key={animal}
                    type="button"
                    onClick={() => updateField("animalsSupported", toggleArray(data.animalsSupported, animal))}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-[10px] border px-3.5 py-3 text-left text-[13.5px] font-semibold transition-all",
                      selected
                        ? "border-forest-900 bg-mint-100 text-forest-900"
                        : "border-line bg-white-warm text-ink-muted hover:border-forest-900/25 hover:bg-mint-50",
                    )}
                  >
                    <span>{animal}</span>
                    {selected ? (
                      <span className="h-3.5 w-3.5 rounded-full bg-forest-900">
                        <span className="h-2 w-2 rounded-full bg-ivory-50" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      </div>
    </section>
  );
}

function toggleArray(current: string[], value: string): string[] {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }
  return [...current, value];
}
