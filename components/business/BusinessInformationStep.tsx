"use client";

import * as React from "react";
import {
  Field,
} from "@/components/ui/label";
import { Input, Select, Textarea } from "@/components/ui/input";
import { PROVIDER_CATEGORIES } from "@/lib/data/providers";
import { cn } from "@/lib/utils";

export type BusinessInformationStepProps = {
  data: {
    businessName: string;
    category: string;
    description: string;
  };
  updateField: <K extends keyof {
    businessName: string;
    category: string;
    description: string;
  }>(
    key: K,
    value: {
      businessName: string;
      category: string;
      description: string;
    }[K],
  ) => void;
};

export function BusinessInformationStep({
  data,
  updateField,
}: BusinessInformationStepProps) {
  const fieldError = (name: string) => undefined;

  return (
    <section>
      <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
          01
        </span>
        <div>
          <h2 className="font-sans text-[16px] font-bold text-forest-900">
            Business information
          </h2>
          <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
            Tell us about your practice and the kind of care you provide.
          </p>
        </div>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <Field label="Business name" htmlFor="business-name" error={fieldError("businessName")}>
          <Input
            id="business-name"
            name="businessName"
            autoComplete="organization"
            maxLength={120}
            required
            defaultValue={data.businessName}
            onChange={(event) => updateField("businessName", event.target.value)}
            placeholder="e.g. Cedar & Clover Veterinary"
          />
        </Field>
        <Field label="Care category" htmlFor="business-category" error={fieldError("category")}>
          <Select
            id="business-category"
            name="category"
            required
            defaultValue={data.category}
            onChange={(event) => updateField("category", event.target.value)}
          >
            <option value="" disabled>
              Choose a category
            </option>
            {PROVIDER_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Business description"
          htmlFor="business-description"
          error={fieldError("description")}
          hint="Describe your animal-care services and facilities in your own words."
          className="sm:col-span-2"
        >
          <Textarea
            id="business-description"
            name="description"
            maxLength={1000}
            required
            defaultValue={data.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Preventive check-ups, dental assessment, diagnostics and senior care..."
          />
        </Field>
      </div>
    </section>
  );
}
