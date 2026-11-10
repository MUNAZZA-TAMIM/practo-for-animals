"use client";

import * as React from "react";
import { useActionState, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Mail,
  Palette,
  PawPrint,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input, Select, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/forms/submit-button";
import { submitAppointmentRequest, type AppointmentRequestState } from "@/app/(marketing)/book-appointment/actions";
import { providers, getCategoryLabel } from "@/lib/data/providers";
import { cn } from "@/lib/utils";

const initialState: AppointmentRequestState = { status: "idle" };

const SERVICE_CATEGORIES = [
  "General Consultation",
  "Vaccination",
  "Dental Assessment",
  "Diagnostics & Ultrasound",
  "Emergency Care",
  "Grooming",
  "Boarding",
  "Home Visits",
  "Senior Care",
  "Other",
] as const;

const ANIMAL_TYPES = ["Dog", "Cat", "Bird", "Rabbit", "Horse", "Cow", "Goat", "Other"] as const;

type BookingData = {
  providerSlug: string;
  providerName: string;
  service: string;
  serviceDescription: string;
  animalName: string;
  animalSpecies: string;
  animalAge: string;
  reasonForVisit: string;
  preferredDate: string;
  preferredTime: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  consent: boolean;
};

export function BookingWizard({
  initialProvider,
}: {
  initialProvider?: { slug: string; name: string };
}) {
  const [state, formAction] = useActionState(submitAppointmentRequest, initialState);
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [data, setData] = useState<BookingData>({
    providerSlug: initialProvider?.slug || "",
    providerName: initialProvider?.name || "",
    service: "",
    serviceDescription: "",
    animalName: "",
    animalSpecies: "",
    animalAge: "",
    reasonForVisit: "",
    preferredDate: "",
    preferredTime: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    consent: false,
  });

  const updateField = <K extends keyof BookingData>(
    key: K,
    value: BookingData[K],
  ) => {
    setData((prev: BookingData) => ({ ...prev, [key]: value }));
  };

  const canGoNext = step < 4;
  const canGoBack = step > 1;

  if (state.status === "success") {
    return (
      <div className="rounded-[22px] border border-forest-700/15 bg-white-warm p-7 shadow-card sm:p-10">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-mint-200 text-forest-800">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-[36px] leading-[1.02] tracking-[-0.04em] text-forest-900 sm:text-[44px]">
          Request submitted.
        </h2>
        <p className="mt-4 max-w-xl text-[14px] leading-7 text-ink-muted">
          Thank you for your appointment request. A provider will review your
          request and confirm availability directly with you.
        </p>

        <div className="mt-6 rounded-xl border border-line bg-ivory-50 p-4">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.15em] text-ink-muted/70">
            Reference
          </p>
          <p className="mt-1 font-display text-[26px] tracking-[0.02em] text-forest-900">
            {state.reference}
          </p>
        </div>

        <ul className="mt-6 space-y-3">
          {[
            "Your request is pending provider review.",
            "No booking is confirmed until a provider accepts the request.",
            "The provider will contact you using the details you provided.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-5 text-forest-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" strokeWidth={2.4} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link href="/find">Browse other providers</Link>
          </Button>
          <Button asChild variant="primary">
            <Link href={`/find?category=${data.service}`}>Find another provider</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" ? (
        <div
          className="flex items-start gap-3 rounded-xl border border-danger-ink/20 bg-danger-bg p-4 outline-none"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger-ink" aria-hidden="true" />
          <div>
            <p className="text-[12.5px] font-bold text-danger-ink">Please check the form</p>
            <p className="mt-1 text-[11.5px] leading-5 text-danger-ink/85">
              {state.message}
            </p>
          </div>
        </div>
      ) : null}

      <div className="rounded-[20px] border border-line bg-white-warm p-6 sm:p-8">
        <div className="mb-6">
          <BookingProgress currentStep={step} />
        </div>

        {step === 1 && <ProviderServiceStep data={data} updateField={updateField} />}
        {step === 2 && <AnimalDetailsStage data={data} updateField={updateField} />}
        {step === 3 && <ContactDetailsStep data={data} updateField={updateField} />}
        {step === 4 && <ReviewStep data={data} />}

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {canGoBack ? (
              <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1 as 1 | 2 | 3 | 4)} className="flex-1 sm:flex-1">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Back
              </Button>
            ) : null}
            {step === 1 ? (
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted/70">
                Step 1 of 4
              </p>
            ) : null}
          </div>

          {step < 4 ? (
            <Button type="button" onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4)} className="flex-1 sm:flex-1">
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button type="submit" className="flex-1 sm:flex-1">
              Submit request
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

function BookingProgress({ currentStep }: { currentStep: number }) {
  const steps = [
    { id: 1, label: "Brief" },
    { id: 2, label: "Research" },
    { id: 3, label: "Outline" },
    { id: 4, label: "Review" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-3">
          <span className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-all",
            step.id < currentStep
              ? "bg-forest-900 border-forest-900 text-ivory-50"
                : step.id === currentStep
                  ? "bg-coral-500 border-coral-500 text-ivory-50"
                  : "bg-white-warm border-line text-ink-muted",
          )}>
            {step.id < currentStep ? (
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            ) : (
              step.id
            )}
          </span>
          <span className={cn(
            "text-[10px] font-semibold transition-colors",
            step.id < currentStep ? "text-forest-700" : step.id === currentStep ? "text-coral-ink" : "text-ink-muted",
          )}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProviderServiceStep({
  data,
  updateField,
}: {
  data: Pick<BookingData, "providerSlug" | "providerName" | "service" | "serviceDescription">;
  updateField: <K extends keyof Pick<BookingData, "providerSlug" | "providerName" | "service" | "serviceDescription">>(
    key: K,
    value: Pick<BookingData, "providerSlug" | "providerName" | "service" | "serviceDescription">[K],
  ) => void;
}) {
  const fieldError = (name: string) => undefined;
  return (
    <section>
      <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
          01
        </span>
        <div>
          <h2 className="font-sans text-[16px] font-bold text-forest-900">
            Choose a service
          </h2>
          <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
            Select the type of appointment you need.
          </p>
        </div>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <Field label="Provider" htmlFor="providerSlug" error={fieldError("providerSlug")}>
          <Select
            id="providerSlug"
            name="providerSlug"
            required
            defaultValue={data.providerSlug}
            onChange={(event) => updateField("providerSlug", event.target.value)}
            aria-invalid={false}
          >
            <option value="" disabled>
              Choose a provider
            </option>
            {providers.map((provider) => (
              <option key={provider.slug} value={provider.slug}>
                {provider.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Service" htmlFor="service" error={fieldError("service")}>
          <Select
            id="service"
            name="service"
            required
            defaultValue={data.service}
            onChange={(event) => updateField("service", event.target.value)}
            aria-invalid={false}
          >
            <option value="" disabled>
              Choose a service type
            </option>
            {SERVICE_CATEGORIES.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Additional details" htmlFor="serviceDescription" optional className="sm:col-span-2">
          <Textarea
            id="serviceDescription"
            name="serviceDescription"
            maxLength={500}
            defaultValue={data.serviceDescription}
            onChange={(event) => updateField("serviceDescription", event.target.value)}
            aria-invalid={false}
            placeholder="Any specific concerns or symptoms you'd like the provider to know about?"
          />
        </Field>
      </div>
    </section>
  );
}

function AnimalDetailsStage({
  data,
  updateField,
}: {
  data: Pick<BookingData, "animalName" | "animalSpecies" | "animalAge" | "reasonForVisit">;
  updateField: <K extends keyof Pick<BookingData, "animalName" | "animalSpecies" | "animalAge" | "reasonForVisit">>(
    key: K,
    value: Pick<BookingData, "animalName" | "animalSpecies" | "animalAge" | "reasonForVisit">[K],
  ) => void;
}) {
  const fieldError = (name: string) => undefined;
  return (
    <section>
      <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
          02
        </span>
        <div>
          <h2 className="font-sans text-[16px] font-bold text-forest-900">
            About your animal
          </h2>
          <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
            Tell us who needs care.
          </p>
        </div>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <Field label="Animal name" htmlFor="animalName" error={fieldError("animalName")}>
          <Input
            id="animalName"
            name="animalName"
            maxLength={80}
            required
            defaultValue={data.animalName}
            onChange={(event) => updateField("animalName", event.target.value)}
            placeholder="e.g. Luna"
          />
        </Field>
        <Field label="Species" htmlFor="animalSpecies" error={fieldError("animalSpecies")}>
          <Select
            id="animalSpecies"
            name="animalSpecies"
            required
            defaultValue={data.animalSpecies}
            onChange={(event) => updateField("animalSpecies", event.target.value)}
            aria-invalid={false}
          >
            <option value="" disabled>
              Choose an animal type
            </option>
            {ANIMAL_TYPES.map((animal) => (
              <option key={animal} value={animal}>
                {animal}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Age (optional)" htmlFor="animalAge" optional>
          <Input
            id="animalAge"
            name="animalAge"
            maxLength={50}
            defaultValue={data.animalAge}
            onChange={(event) => updateField("animalAge", event.target.value)}
            placeholder="e.g. 3 years, 6 months"
          />
        </Field>
        <Field label="Reason for visit" htmlFor="reasonForVisit" optional className="sm:col-span-2">
          <Textarea
            id="reasonForVisit"
            name="reasonForVisit"
            maxLength={1000}
            defaultValue={data.reasonForVisit}
            onChange={(event) => updateField("reasonForVisit", event.target.value)}
            placeholder="What brings your animal in today?"
            aria-invalid={false}
          />
        </Field>
      </div>
    </section>
  );
}

function ContactDetailsStep({
  data,
  updateField,
}: {
  data: Pick<BookingData, "contactName" | "contactEmail" | "contactPhone">;
  updateField: <K extends keyof Pick<BookingData, "contactName" | "contactEmail" | "contactPhone">>(
    key: K,
    value: Pick<BookingData, "contactName" | "contactEmail" | "contactPhone">[K],
  ) => void;
}) {
  const fieldError = (name: string) => undefined;
  return (
    <section>
      <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
          03
        </span>
        <div>
          <h2 className="font-sans text-[16px] font-bold text-forest-900">
            Contact information
          </h2>
          <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
            How can the provider reach you?
          </p>
        </div>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <Field label="Your name" htmlFor="contactName" error={fieldError("contactName")}>
          <Input
            id="contactName"
            name="contactName"
            autoComplete="name"
            maxLength={80}
            required
            defaultValue={data.contactName}
            onChange={(event) => updateField("contactName", event.target.value)}
            placeholder="e.g. Sarah Chen"
            aria-invalid={false}
          />
        </Field>
        <Field label="Email" htmlFor="contactEmail" error={fieldError("contactEmail")}>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            autoComplete="email"
            maxLength={160}
            required
            defaultValue={data.contactEmail}
            onChange={(event) => updateField("contactEmail", event.target.value)}
            placeholder="name@example.com"
            aria-invalid={false}
          />
        </Field>
        <Field label="Phone" htmlFor="contactPhone" error={fieldError("contactPhone")}>
          <Input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            autoComplete="tel"
            maxLength={24}
            required
            defaultValue={data.contactPhone}
            onChange={(event) => updateField("contactPhone", event.target.value)}
            placeholder="+91 80 5550 0100"
            aria-invalid={false}
          />
        </Field>
      </div>
    </section>
  );
}

function ReviewStep({
  data,
}: {
  data: BookingData;
}) {
  return (
    <section>
      <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
          04
        </span>
        <div>
          <h2 className="font-sans text-[16px] font-bold text-forest-900">
            Review & submit
          </h2>
          <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
            Check your information before submitting.
          </p>
        </div>
      </div>
      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
        <div className="rounded-xl border border-line bg-white-warm p-5 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700 mb-3">
            Provider
          </p>
          <p className="text-[13px] font-bold text-forest-900 mb-1">
            {data.providerName}
          </p>
          <p className="text-[12px] leading-5 text-ink-muted">
            {data.serviceDescription || "No additional details provided"}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-white-warm p-5 sm:p-6 sm:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700 mb-3">
            Contact information
          </p>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-3 w-3 shrink-0 text-forest-600" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                  Phone
                </p>
                <p className="text-[12px] font-semibold text-forest-900">
                  {data.contactPhone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-3 w-3 shrink-0 text-forest-600" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                  Email
                </p>
                <p className="text-[12px] font-semibold text-forest-900">
                  {data.contactEmail}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white-warm p-5 sm:p-6 sm:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700 mb-3">
            Preferred date & time
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-start gap-2.5">
              <Clock3 className="mt-0.5 h-3 w-3 shrink-0 text-forest-600" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                  Preferred date
                </p>
                <p className="text-[12px] font-semibold text-forest-900">
                  {data.preferredDate}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock3 className="mt-0.5 h-3 w-3 shrink-0 text-forest-600" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                  Preferred time
                </p>
                <p className="text-[12px] font-semibold text-forest-900">
                  {data.preferredTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-ivory-100/60 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint-200 text-forest-800">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">
              Confirmation & consent
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted/70 mt-1">
              I confirm the information above is accurate and consent to this
              request being stored for review.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" className="flex-1 sm:flex-1">
            Submit request
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
