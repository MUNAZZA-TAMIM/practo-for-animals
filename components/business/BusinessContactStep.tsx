"use client";

import * as React from "react";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type BusinessContactStepProps = {
  data: {
    phone: string;
    email: string;
    website: string;
    contactPerson: string;
  };
  updateField: <K extends keyof {
    phone: string;
    email: string;
    website: string;
    contactPerson: string;
  }>(
    key: K,
    value: {
      phone: string;
      email: string;
      website: string;
      contactPerson: string;
    }[K],
  ) => void;
};

export function BusinessContactStep({
  data,
  updateField,
}: BusinessContactStepProps) {
  const fieldError = (name: string) => undefined;
  return (
    <section>
      <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
          04
        </span>
        <div>
          <h2 className="font-sans text-[16px] font-bold text-forest-900">
            Contact information
          </h2>
          <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
            How can animal owners reach your practice?
          </p>
        </div>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <Field label="Business phone" htmlFor="business-phone" error={fieldError("phone")}>
          <Input
            id="business-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={24}
            required
            defaultValue={data.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+91 80 5550 0100"
          />
        </Field>
        <Field label="Business email" htmlFor="business-email" error={fieldError("email")}>
          <Input
            id="business-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={160}
            required
            defaultValue={data.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="name@practice.example"
          />
        </Field>
        <Field label="Website" htmlFor="business-website" optional hint="Include the full URL, starting with http:// or https://." className="sm:col-span-2">
          <Input
            id="business-website"
            name="website"
            type="url"
            maxLength={500}
            defaultValue={data.website}
            onChange={(event) => updateField("website", event.target.value)}
            placeholder="https://yourpractice.example"
          />
        </Field>
        <Field label="Contact person" htmlFor="contact-person" optional hint="The person who will handle enquiries.">
          <Input
            id="contact-person"
            name="contactPerson"
            autoComplete="name"
            maxLength={80}
            defaultValue={data.contactPerson}
            onChange={(event) => updateField("contactPerson", event.target.value)}
            placeholder="e.g. Dr. Meera Rao"
          />
        </Field>
      </div>
    </section>
  );
}
