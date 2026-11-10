"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitBusinessListing, type BusinessListingState } from "@/app/(marketing)/list-business/actions";
import { BusinessProgress } from "./BusinessProgress";
import { BusinessInformationStep } from "./BusinessInformationStep";
import { ServicesAnimalsStep } from "./ServicesAnimalsStep";
import { BusinessLocationStep } from "./BusinessLocationStep";
import { BusinessContactStep } from "./BusinessContactStep";
import { BusinessDetailsStep } from "./BusinessDetailsStep";
import { BusinessReviewStep } from "./BusinessReviewStep";

const initialState: BusinessListingState = { status: "idle" };

const STEPS = [
  { id: 1, label: "Business information" },
  { id: 2, label: "Services & animals" },
  { id: 3, label: "Location" },
  { id: 4, label: "Contact information" },
  { id: 5, label: "Business details" },
  { id: 6, label: "Review & submit" },
] as const;

export type BusinessFormData = {
  businessName: string;
  category: string;
  description: string;
  services: string[];
  animalsSupported: string[];
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  contactPerson: string;
  businessHours: string;
  additionalInformation: string;
  appointmentInformation: string;
  emergencyServiceInformation: string;
  consent: boolean;
};

const emptyData: BusinessFormData = {
  businessName: "",
  category: "",
  description: "",
  services: [],
  animalsSupported: [],
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  phone: "",
  email: "",
  website: "",
  contactPerson: "",
  businessHours: "",
  additionalInformation: "",
  appointmentInformation: "",
  emergencyServiceInformation: "",
  consent: false,
};

export function BusinessFormWizard() {
  const [state, formAction] = useActionState(submitBusinessListing, initialState);
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState<BusinessFormData>(emptyData);

  const totalSteps = STEPS.length;
  const canGoNext = step < totalSteps;
  const canGoBack = step > 1;

  const updateField = <K extends keyof BusinessFormData>(
    key: K,
    value: BusinessFormData[K],
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => {
    if (canGoNext) setStep((s) => s + 1);
  };

  const back = () => {
    if (canGoBack) setStep((s) => s - 1);
  };

  if (state.status === "success") {
    return (
      <div className="rounded-[22px] border border-forest-700/15 bg-white-warm p-7 shadow-card sm:p-10">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-mint-200 text-forest-800">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-[36px] leading-[1.02] tracking-[-0.04em] text-forest-900 sm:text-[44px]">
          Listing submitted.
        </h2>
        <p className="mt-4 max-w-xl text-[14px] leading-7 text-ink-muted">
          Thank you for sharing your animal-care services. Your submission has
          been received.
        </p>

        <div className="mt-6 rounded-xl border border-line bg-ivory-50 p-4">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.15em] text-ink-muted/70">
            Reference
          </p>
          <p className="mt-1 font-display text-[26px] tracking-[0.02em] text-forest-900">
            {state.reference}
          </p>
          <p className="mt-2 text-[10.5px] leading-5 text-ink-muted">
            Keep this reference if you want to discuss the submission. In this
            demo, it is stored only in the local JSON data store.
          </p>
        </div>

        <ul className="mt-6 space-y-3">
          {[
            "A human reviews the submission for completeness and clarity.",
            "No verification, publication or partnership is implied by submitting.",
            "This environment does not send email or trigger a live n8n workflow.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-5 text-forest-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" strokeWidth={2.4} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/">
              Return to home
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/find">
              Explore animal care
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" ? (
        <div
          ref={undefined}
          tabIndex={-1}
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 rounded-xl border border-danger-ink/20 bg-danger-bg p-4 outline-none"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger-ink" aria-hidden="true" />
          <div>
            <p className="text-[12.5px] font-bold text-danger-ink">
              Please check your submission
            </p>
            <p className="mt-1 text-[11.5px] leading-5 text-danger-ink/85">
              {state.message}
            </p>
          </div>
        </div>
      ) : null}

      {/* Hidden inputs for all form data so they submit with the form */}
      {Object.entries(data).map(([key, value]) => (
        <input
          key={key}
          name={key}
          type="hidden"
          defaultValue={
            Array.isArray(value) ? value.join(",") : String(value)
          }
        />
      ))}

      <div className="rounded-[20px] border border-line bg-white-warm p-6 sm:p-8">
        <div className="mb-6">
          <BusinessProgress currentStep={step} />
        </div>

        {step === 1 && (
          <BusinessInformationStep
            data={data}
            updateField={updateField}
          />
        )}
        {step === 2 && (
          <ServicesAnimalsStep
            data={data}
            updateField={updateField}
          />
        )}
        {step === 3 && (
          <BusinessLocationStep
            data={data}
            updateField={updateField}
          />
        )}
        {step === 4 && (
          <BusinessContactStep
            data={data}
            updateField={updateField}
          />
        )}
        {step === 5 && (
          <BusinessDetailsStep
            data={data}
            updateField={updateField}
          />
        )}
        {step === 6 && (
          <BusinessReviewStep
            data={data}
            updateField={updateField}
          />
        )}

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {canGoBack ? (
              <Button
                type="button"
                variant="secondary"
                onClick={back}
                className="flex-1 sm:flex-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Back
              </Button>
            ) : null}
            {step === 1 ? (
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted/70">
                Step 1 of 6
              </p>
            ) : null}
          </div>

          {step < totalSteps ? (
            <Button type="button" onClick={next} className="flex-1 sm:flex-1">
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button type="submit" className="flex-1 sm:flex-1">
              Submit business listing
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
