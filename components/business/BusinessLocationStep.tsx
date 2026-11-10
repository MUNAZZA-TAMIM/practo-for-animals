"use client";

import * as React from "react";
import { Field } from "@/components/ui/label";
import { Input, Select } from "@/components/ui/input";
import { CITIES } from "@/lib/data/providers";
import { cn } from "@/lib/utils";

export type BusinessLocationStepProps = {
  data: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  updateField: <K extends keyof {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>(
    key: K,
    value: {
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    }[K],
  ) => void;
};

export function BusinessLocationStep({
  data,
  updateField,
}: BusinessLocationStepProps) {
  const fieldError = (name: string) => undefined;
  return (
    <section>
      <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
          03
        </span>
        <div>
          <h2 className="font-sans text-[16px] font-bold text-forest-900">
            Location
          </h2>
          <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
            Where can animal owners find your practice?
          </p>
        </div>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <Field label="Address line 1" htmlFor="address-line-1" error={fieldError("addressLine1")}>
          <Input
            id="address-line-1"
            name="addressLine1"
            autoComplete="street-address"
            maxLength={200}
            required
            defaultValue={data.addressLine1}
            onChange={(event) => updateField("addressLine1", event.target.value)}
            placeholder="e.g. 12, 100 Feet Road"
          />
        </Field>
        <Field label="Address line 2" htmlFor="address-line-2" optional>
          <Input
            id="address-line-2"
            name="addressLine2"
            autoComplete="street-address"
            maxLength={200}
            defaultValue={data.addressLine2}
            onChange={(event) => updateField("addressLine2", event.target.value)}
            placeholder="e.g. Apartment 4B"
          />
        </Field>
        <Field label="City" htmlFor="business-city" error={fieldError("city")}>
          <Select
            id="business-city"
            name="city"
            required
            defaultValue={data.city}
            onChange={(event) => updateField("city", event.target.value)}
          >
            <option value="" disabled>
              Choose a city
            </option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="State / province" htmlFor="business-state" optional>
          <Input
            id="business-state"
            name="state"
            autoComplete="address-level1"
            maxLength={80}
            defaultValue={data.state}
            onChange={(event) => updateField("state", event.target.value)}
            placeholder="e.g. Karnataka"
          />
        </Field>
        <Field label="Postal code" htmlFor="business-postal-code" optional>
          <Input
            id="business-postal-code"
            name="postalCode"
            autoComplete="postal-code"
            maxLength={20}
            defaultValue={data.postalCode}
            onChange={(event) => updateField("postalCode", event.target.value)}
            placeholder="e.g. 560038"
          />
        </Field>
        <Field label="Country" htmlFor="business-country" error={fieldError("country")}>
          <Select
            id="business-country"
            name="country"
            required
            defaultValue={data.country}
            onChange={(event) => updateField("country", event.target.value)}
          >
            <option value="India">India</option>
          </Select>
        </Field>
      </div>
    </section>
  );
}
