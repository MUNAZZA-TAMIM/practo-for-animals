"use client";

import * as React from "react";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type BusinessDetailsStepProps = {
  data: {
    businessHours: string;
    additionalInformation: string;
    appointmentInformation: string;
    emergencyServiceInformation: string;
  };
  updateField: <K extends keyof {
    businessHours: string;
    additionalInformation: string;
    appointmentInformation: string;
    emergencyServiceInformation: string;
  }>(
    key: K,
    value: {
      businessHours: string;
      additionalInformation: string;
      appointmentInformation: string;
      emergencyServiceInformation: string;
    }[K],
  ) => void;
};

export function BusinessDetailsStep({
  data,
  updateField,
}: BusinessDetailsStepProps) {
  const fieldError = (name: string) => undefined;
  return (
    <section>
      <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
          05
        </span>
        <div>
          <h2 className="font-sans text-[16px] font-bold text-forest-900">
            Business details
          </h2>
          <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
            Optional information to help animal owners plan their visit.
          </p>
        </div>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <Field label="Business hours" htmlFor="business-hours" optional hint="e.g. Mon–Sat · 9:00–19:00">
          <Input
            id="business-hours"
            name="businessHours"
            maxLength={200}
            defaultValue={data.businessHours}
            onChange={(event) => updateField("businessHours", event.target.value)}
            aria-invalid={false}
          />
        </Field>
        <Field label="Additional information" htmlFor="additional-information" optional hint="Anything else animal owners should know." className="sm:col-span-2">
          <Textarea
            id="additional-information"
            name="additionalInformation"
            maxLength={1000}
            defaultValue={data.additionalInformation}
            onChange={(event) => updateField("additionalInformation", event.target.value)}
            placeholder="Facilities, accessibility, languages spoken..."
            aria-invalid={false}
          />
        </Field>
        <Field label="Appointment information" htmlFor="appointment-information" optional hint="How can people book an appointment?" className="sm:col-span-2">
          <Textarea
            id="appointment-information"
            name="appointmentInformation"
            maxLength={500}
            defaultValue={data.appointmentInformation}
            onChange={(event) => updateField("appointmentInformation", event.target.value)}
            placeholder="Book online, call ahead, walk-ins welcome..."
            aria-invalid={false}
          />
        </Field>
        <Field label="Emergency service information" htmlFor="emergency-service-information" optional hint="Emergency contact or after-hours guidance." className="sm:col-span-2">
          <Textarea
            id="emergency-service-information"
            name="emergencyServiceInformation"
            maxLength={500}
            defaultValue={data.emergencyServiceInformation}
            onChange={(event) => updateField("emergencyServiceInformation", event.target.value)}
            placeholder="Emergency line, after-hours protocol..."
            aria-invalid={false}
          />
        </Field>
      </div>
    </section>
  );
}
