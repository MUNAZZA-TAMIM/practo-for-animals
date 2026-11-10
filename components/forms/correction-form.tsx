"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FilePenLine,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  ExternalLink,
} from "lucide-react";
import {
  submitCorrection,
  type CorrectionFormState,
} from "@/app/(marketing)/submit-correction/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/label";
import { ConsentField } from "@/components/ui/feedback";
import { Input, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/forms/submit-button";
import { cn } from "@/lib/utils";
import { getCategoryLabel } from "@/lib/data/providers";

type ProviderOption = {
  slug: string;
  name: string;
  area: string;
  city: string;
  phone: string;
  address: string;
  website?: string;
  hours: string;
  services: string[];
  category: string;
  about?: string;
};

const initialState: CorrectionFormState = { status: "idle" };

const CORRECTION_FIELDS = [
  {
    value: "phone",
    label: "Phone number",
    icon: Phone,
    hint: "Update the contact phone number.",
  },
  {
    value: "address",
    label: "Address",
    icon: MapPin,
    hint: "Update the street address or location.",
  },
  {
    value: "website",
    label: "Website",
    icon: ExternalLink,
    hint: "Update the practice website URL.",
  },
  {
    value: "hours",
    label: "Opening hours",
    icon: Clock3,
    hint: "Update operating hours.",
  },
  {
    value: "services",
    label: "Services offered",
    icon: Stethoscope,
    hint: "Update the list of services provided.",
  },
  {
    value: "other",
    label: "Something else",
    icon: FilePenLine,
    hint: "Report any other incorrect information.",
  },
] as const;

function getCurrentValue(provider: ProviderOption, field: string): string {
  switch (field) {
    case "phone":
      return provider.phone;
    case "address":
      return provider.address;
    case "website":
      return provider.website || "Not listed";
    case "hours":
      return provider.hours;
    case "services":
      return provider.services.join(", ");
    default:
      return "Not specified";
  }
}

export function CorrectionForm({
  providers,
  defaultProvider = "",
}: {
  providers: ProviderOption[];
  defaultProvider?: string;
}) {
  const [state, formAction] = useActionState(submitCorrection, initialState);
  const [providerSlug, setProviderSlug] = React.useState(defaultProvider || "");
  const [field, setField] = React.useState("");
  const errorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (state.status === "error") errorRef.current?.focus();
  }, [state]);

  const provider = providers.find((item) => item.slug === providerSlug);
  const hasProvider = Boolean(provider);
  const currentValue = provider ? getCurrentValue(provider, field) : null;
  const categoryLabel = provider
    ? getCategoryLabel(provider.category as any)
    : "";

  if (state.status === "success") {
    return (
      <div className="rounded-[22px] border border-forest-700/15 bg-white-warm p-7 shadow-card sm:p-10">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-mint-200 text-forest-800">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-[36px] leading-[1.02] tracking-[-0.04em] text-forest-900 sm:text-[44px]">
          Correction queued.
        </h2>
        <p className="mt-4 max-w-xl text-[14px] leading-7 text-ink-muted">
          Thank you for taking the time to make the directory more accurate. A founder or
          administrator reviews corrections before a sample listing is changed.
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
            "Your proposed change is held next to the current sample value.",
            "A human reviewer approves or rejects it with a note.",
            "No listing is verified, published or endorsed by this action.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-5 text-forest-800">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" strokeWidth={2.4} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          {providerSlug ? (
            <Button asChild>
              <Link href={`/providers/${providerSlug}`}>
                Back to the listing
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/find">Browse the directory</Link>
            </Button>
          )}
          <Button asChild variant="secondary">
            <Link href="/find">Browse the directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Provider not selected state
  if (!providerSlug) {
    return (
      <form action={formAction} className="space-y-6">
        {/* Honeypot */}
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
              <p className="text-[12.5px] font-bold text-danger-ink">Please check the form</p>
              <p className="mt-1 text-[11.5px] leading-5 text-danger-ink/85">
                {state.message}
              </p>
            </div>
          </div>
        ) : null}

        <section className="rounded-[20px] border border-line bg-white-warm p-6 sm:p-8">
          <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
              01
            </span>
            <div>
              <h2 className="font-sans text-[16px] font-bold text-forest-900">
                Choose a provider
              </h2>
              <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
                Select the listing whose information needs correcting.
              </p>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
            {providers.map((provider) => (
              <button
                key={provider.slug}
                type="button"
                onClick={() => setProviderSlug(provider.slug)}
                className={cn(
                  "flex flex-col items-start gap-3 rounded-[20px] border p-5 text-left transition-all",
                  providerSlug === provider.slug
                    ? "border-forest-900 bg-mint-50 text-forest-900"
                    : "border-line bg-white-warm text-ink-muted hover:border-forest-900/25 hover:bg-mint-100",
                )}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-[18px] leading-[1.05] tracking-[-0.02em] text-forest-900">
                    {provider.name}
                  </h3>
                  <BadgeCategory category={provider.category as any} />
                </div>
                <p className="text-[12px] leading-5 text-ink-muted">
                  {provider.area}, {provider.city}
                </p>
                <ArrowRight className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
              </button>
            ))}
            <p className="mt-4 text-[10.5px] text-ink-muted">
              Select a provider to begin suggesting corrections.
            </p>
          </div>
        </section>
      </form>
    );
  }

  // Provider not found state
  if (!provider && providerSlug) {
    return (
      <form action={formAction} className="space-y-6">
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
              <p className="text-[12.5px] font-bold text-danger-ink">Please check the form</p>
              <p className="mt-1 text-[11.5px] leading-5 text-danger-ink/85">
                {state.message}
              </p>
            </div>
          </div>
        ) : null}

        <section className="rounded-[20px] border border-line bg-white-warm p-6 sm:p-8">
          <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
              01
            </span>
            <div>
              <h2 className="font-sans text-[16px] font-bold text-forest-900">
                Provider not found
              </h2>
              <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
                The listing you&#39;re trying to correct could not be found.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <p className="text-[12px] leading-5 text-ink-muted">
              Please select a different provider from the directory, or start a
              new correction from a listing page.
            </p>
            <Button asChild variant="secondary">
              <Link href="/find">Browse the directory</Link>
            </Button>
          </div>
        </section>
      </form>
    );
  }

  // Main form - provider selected
  return (
    <form action={formAction} className="space-y-6">
      {/* Honeypot */}
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
            <p className="text-[12.5px] font-bold text-danger-ink">Please check the form</p>
            <p className="mt-1 text-[11.5px] leading-5 text-danger-ink/85">
              {state.message}
            </p>
          </div>
        </div>
      ) : null}

      {/* Provider context card */}
      <section className="rounded-[20px] border border-line bg-white-warm p-6 sm:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-2">
            <BadgeCategory category={provider!.category as any} />
            <Badge variant="sample" className="bg-ivory-50/92 text-amber-ink backdrop-blur-sm">
              Sample listing
            </Badge>
          </div>
          <Link
            href={`/providers/${providerSlug}`}
            className="inline-flex items-center gap-2 text-[10px] font-bold text-forest-900 underline-offset-4 hover:underline"
          >
            View listing
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
        <h2 className="font-display text-[24px] leading-tight tracking-[-0.03em] text-forest-900 sm:text-[28px]">
          {provider!.name}
        </h2>
        <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-ink-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
          {provider!.area}, {provider!.city}
        </p>
        <p className="mt-2 text-[12px] leading-5 text-ink-muted">
          {provider!.about}
        </p>
      </section>

      {/* Step 1: Provider & Field */}
      <section className="rounded-[20px] border border-line bg-white-warm">
        <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
            01
          </span>
          <div>
            <h2 className="font-sans text-[16px] font-bold text-forest-900">
              What needs correcting?
            </h2>
            <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
              Choose the information that needs correcting.
            </p>
          </div>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          {CORRECTION_FIELDS.map((item) => {
            const isSelected = field === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setField(item.value)}
                className={cn(
                  "flex flex-col items-start gap-3 rounded-[20px] border p-4 transition-all",
                  isSelected
                    ? "border-forest-900 bg-mint-50 text-forest-900"
                    : "border-line bg-white-warm text-ink-muted hover:border-forest-900/25 hover:bg-mint-100",
                )}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  <span className="font-semibold text-forest-900">{item.label}</span>
                </div>
                <p className="text-[10.5px] leading-4 text-ink-muted">
                  {item.hint}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Current value */}
      {hasProvider && field && (
        <section className="rounded-[20px] border border-line bg-white-warm p-6 sm:p-8">
          <div className="flex items-start gap-4 border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <Clock3 className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
              <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-muted/70">
                Current sample value
              </p>
            </div>
          </div>
          <div className="mt-1.5 flex items-start gap-2">
            <Clock3 className="h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
            <p className="text-[12.5px] leading-5 text-forest-900">
              {currentValue || "Not listed"}
            </p>
          </div>
        </section>
      )}

      {/* Step 2b: Correction details */}
      <section className="rounded-[20px] border border-line bg-white-warm">
        <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
            02
          </span>
          <div>
            <h2 className="font-sans text-[16px] font-bold text-forest-900">
              The correction
            </h2>
            <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
              Be specific. A source helps a reviewer act with confidence.
            </p>
          </div>
        </div>
        <div className="grid gap-5 p-5 sm:p-6">
          <Field
            label="Correct information"
            htmlFor="proposedValue"
            error={state.fieldErrors?.[field]?.[0]}
            hint="If correcting services, separate each service with a comma."
            className="sm:col-span-2"
          >
            <Textarea
              id="proposedValue"
              name="proposedValue"
              maxLength={800}
              required
              defaultValue=""
              aria-invalid={Boolean(state.fieldErrors?.[field]?.[0])}
              placeholder="The corrected phone number, address, website URL, hours, or service list."
            />
          </Field>
          <Field
            label="Source or evidence link"
            htmlFor="evidenceUrl"
            optional
            error={state.fieldErrors?.evidenceUrl?.[0]}
            hint="A public page that supports the correction. Do not link private documents."
          >
            <Input
              id="evidenceUrl"
              name="evidenceUrl"
              type="url"
              maxLength={500}
              aria-invalid={Boolean(state.fieldErrors?.evidenceUrl?.[0])}
              placeholder="https://..."
            />
          </Field>
          <Field label="Anything else to add?" htmlFor="note" optional error={state.fieldErrors?.note?.[0]}>
            <Textarea
              id="note"
              name="note"
              maxLength={1000}
              aria-invalid={Boolean(state.fieldErrors?.note?.[0])}
              placeholder="Context for the reviewer."
            />
          </Field>
        </div>
      </section>

      {/* Step 3: Contact information */}
      <section className="rounded-[20px] border border-line bg-white-warm">
        <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
            03
          </span>
          <div>
            <h2 className="font-sans text-[16px] font-bold text-forest-900">
              Contact information
            </h2>
            <p className="mt-1 text-[11.5px] leading-5 text-ink-muted">
              For follow-up on this specific submission only.
            </p>
          </div>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <Field label="Your name" htmlFor="submitterName" error={state.fieldErrors?.submitterName?.[0]}>
            <Input
              id="submitterName"
              name="submitterName"
              autoComplete="name"
              maxLength={80}
              required
              aria-invalid={Boolean(state.fieldErrors?.submitterName?.[0])}
            />
          </Field>
          <Field label="Email" htmlFor="submitterEmail" error={state.fieldErrors?.submitterEmail?.[0]}>
            <Input
              id="submitterEmail"
              name="submitterEmail"
              type="email"
              autoComplete="email"
              maxLength={160}
              required
              aria-invalid={Boolean(state.fieldErrors?.submitterEmail?.[0])}
            />
          </Field>
        </div>
      </section>

      <div className="rounded-[18px] border border-line bg-ivory-100/60 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <ConsentField
            id="consent"
            label={
              <>
                I confirm this correction is made in good faith and consent to it being stored for
                review in this demo.
              </>
            }
            error={state.fieldErrors?.consent?.[0]}
          />
        </div>
        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-[10.5px] leading-4 text-ink-muted">
            <FilePenLine className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Stored locally. No email is sent.
          </p>
          <SubmitButton pendingLabel="Queuing correction…">
            Submit correction
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}

function BadgeCategory({ category }: { category: string }) {
  const labels: Record<string, string> = {
    veterinary: "Veterinary care",
    emergency: "Emergency care",
    grooming: "Grooming & wellness",
    boarding: "Boarding & daycare",
    training: "Training & behaviour",
    mobile: "Home visits",
    exotic: "Exotic & avian care",
    rescue: "Rescues & rehoming",
    equine: "Equine care",
  };
  return (
    <span className="rounded-full border border-line bg-white-warm px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-forest-800">
      {labels[category] || category}
    </span>
  );
}
