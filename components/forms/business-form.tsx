"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { submitBusinessEnquiry, type BusinessFormState } from "@/app/(marketing)/list-business/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { ConsentField } from "@/components/ui/feedback";
import { Input, Select, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/forms/submit-button";
import { CITIES, PROVIDER_CATEGORIES } from "@/lib/data/providers";

const initialState: BusinessFormState = { status: "idle" };

export function BusinessForm() {
  const [state, formAction] = useActionState(submitBusinessEnquiry, initialState);
  const errorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (state.status === "error") errorRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="rounded-[22px] border border-forest-700/15 bg-white-warm p-7 shadow-card sm:p-10">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-mint-200 text-forest-800">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-[36px] leading-[1.02] tracking-[-0.04em] text-forest-900 sm:text-[44px]">
          Enquiry received.
        </h2>
        <p className="mt-4 max-w-xl text-[14px] leading-7 text-ink-muted">
          Your details are in the review queue. Nothing has been published. A listing would only
          be prepared after a human review of the information you shared.
        </p>

        <div className="mt-6 rounded-xl border border-line bg-ivory-50 p-4">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.15em] text-ink-muted/70">
            Reference
          </p>
          <p className="mt-1 font-display text-[26px] tracking-[0.02em] text-forest-900">
            {state.reference}
          </p>
          <p className="mt-2 text-[10.5px] leading-5 text-ink-muted">
            Keep this reference if you want to discuss the submission. In this demo, it is stored
            only in the local JSON data store.
          </p>
        </div>

        <ul className="mt-6 space-y-3">
          {[
            "A human reviews the submission for completeness and clarity.",
            "No verification, publication or partnership is implied by submitting.",
            "This environment does not send email or trigger a live n8n workflow.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-5 text-forest-800">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" strokeWidth={2.4} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/find">
              Browse the directory
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const fieldError = (name: string) => state.fieldErrors?.[name]?.[0];

  return (
    <form action={formAction} className="space-y-5">
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="companyWebsite">Company website</label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.status === "error" ? (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 rounded-xl border border-danger-ink/20 bg-danger-bg p-4 outline-none"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger-ink" aria-hidden="true" />
          <div>
            <p className="text-[12.5px] font-bold text-danger-ink">Please check your submission</p>
            <p className="mt-1 text-[11.5px] leading-5 text-danger-ink/85">{state.message}</p>
          </div>
        </div>
      ) : null}

      <section className="rounded-[20px] border border-line bg-white-warm">
        <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
            01
          </span>
          <div>
            <h2 className="font-sans text-[16px] font-bold text-forest-900">The basics</h2>
            <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
              Who you are and what kind of care you provide.
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
              aria-invalid={Boolean(fieldError("contactName"))}
              placeholder="e.g. Aditi Sharma"
            />
          </Field>
          <Field label="Business or practice name" htmlFor="businessName" error={fieldError("businessName")}>
            <Input
              id="businessName"
              name="businessName"
              maxLength={120}
              required
              aria-invalid={Boolean(fieldError("businessName"))}
              placeholder="e.g. Cedar & Clover Veterinary"
            />
          </Field>
          <Field label="Care category" htmlFor="category" error={fieldError("category")}>
            <Select
              id="category"
              name="category"
              required
              defaultValue=""
              aria-invalid={Boolean(fieldError("category"))}
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
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" htmlFor="city" error={fieldError("city")}>
              <Select
                id="city"
                name="city"
                required
                defaultValue=""
                aria-invalid={Boolean(fieldError("city"))}
              >
                <option value="" disabled>
                  Choose
                </option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Area" htmlFor="area" error={fieldError("area")}>
              <Input
                id="area"
                name="area"
                required
                maxLength={80}
                aria-invalid={Boolean(fieldError("area"))}
                placeholder="e.g. Indiranagar"
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-[20px] border border-line bg-white-warm">
        <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
            02
          </span>
          <div>
            <h2 className="font-sans text-[16px] font-bold text-forest-900">How people reach you</h2>
            <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
              These details would appear on the profile after review.
            </p>
          </div>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <Field label="Email" htmlFor="email" error={fieldError("email")}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={160}
              required
              aria-invalid={Boolean(fieldError("email"))}
              placeholder="name@practice.example"
            />
          </Field>
          <Field label="Phone" htmlFor="phone" error={fieldError("phone")}>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={24}
              required
              aria-invalid={Boolean(fieldError("phone"))}
              placeholder="+91 80 5550 0100"
            />
          </Field>
          <Field
            label="Website"
            htmlFor="website"
            optional
            error={fieldError("website")}
            className="sm:col-span-2"
            hint="Include the full URL, starting with http:// or https://."
          >
            <Input
              id="website"
              name="website"
              type="url"
              maxLength={500}
              aria-invalid={Boolean(fieldError("website"))}
              placeholder="https://yourpractice.example"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-[20px] border border-line bg-white-warm">
        <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
            03
          </span>
          <div>
            <h2 className="font-sans text-[16px] font-bold text-forest-900">What you offer</h2>
            <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
              Plain descriptions are more useful than marketing language.
            </p>
          </div>
        </div>
        <div className="grid gap-5 p-5 sm:p-6">
          <Field
            label="Services"
            htmlFor="services"
            error={fieldError("services")}
            hint="A short, comma-separated list works well. No claim needs to be final at this stage."
          >
            <Textarea
              id="services"
              name="services"
              maxLength={500}
              required
              aria-invalid={Boolean(fieldError("services"))}
              placeholder="Preventive check-ups, dental assessment, diagnostics, senior care"
            />
          </Field>
          <Field
            label="Species you work with"
            htmlFor="species"
            error={fieldError("species")}
            hint="For example: dogs, cats, rabbits, birds, horses, livestock."
          >
            <Input
              id="species"
              name="species"
              maxLength={300}
              required
              aria-invalid={Boolean(fieldError("species"))}
              placeholder="Dogs, cats and small companion animals"
            />
          </Field>
          <Field
            label="Anything else we should know?"
            htmlFor="message"
            optional
            error={fieldError("message")}
          >
            <Textarea
              id="message"
              name="message"
              maxLength={1500}
              aria-invalid={Boolean(fieldError("message"))}
              placeholder="Hours, facilities, accessibility, languages spoken, or the story behind the practice."
            />
          </Field>
        </div>
      </section>

      <div className="rounded-[18px] border border-line bg-ivory-100/60 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint-200 text-forest-800">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[12.5px] font-bold text-forest-900">What this demo does with your data</p>
            <p className="mt-1 text-[11px] leading-5 text-ink-muted">
              The submission is stored in a local JSON file for the founder dashboard. It is not
              emailed, sent to a CRM, or used to contact you. Do not enter sensitive personal or
              clinical information.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <ConsentField
            id="consent"
            label={
              <>
                I confirm this is sample or accurate business information and consent to it being
                stored for review in this demo. I understand no listing will be published.
              </>
            }
            error={fieldError("consent")}
          />
        </div>
        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-[10.5px] leading-4 text-ink-muted">
            <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            No marketing email will be sent.
          </p>
          <SubmitButton pendingLabel="Saving enquiry…">
            Submit for review
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
