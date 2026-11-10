"use client";

import * as React from "react";
import { useActionState } from "react";
import { CircleAlert, Lock, Sparkles } from "lucide-react";
import {
  submitEducationEnquiry,
  type EducationFormState,
} from "@/app/(marketing)/education/actions";
import { Field } from "@/components/ui/label";
import { ConsentField } from "@/components/ui/feedback";
import { Input, Select, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/forms/submit-button";
import { CITIES } from "@/lib/data/providers";

const initialState: EducationFormState = { status: "idle" };

const roles = [
  { value: "veterinarian", label: "Veterinarian" },
  { value: "veterinary-nurse", label: "Veterinary nurse or technician" },
  { value: "clinic-owner", label: "Clinic owner or practice manager" },
  { value: "animal-ngo", label: "Animal NGO or rescue team" },
  { value: "pet-care-founder", label: "Pet-care founder" },
  { value: "marketer", label: "Marketer or content lead" },
  { value: "other", label: "Something else" },
];

export function EducationForm({
  programmes,
  defaultProgramme,
}: {
  programmes: { slug: string; name: string; duration: string }[];
  defaultProgramme?: string;
}) {
  const [state, formAction] = useActionState(submitEducationEnquiry, initialState);
  const errorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (state.status === "error") errorRef.current?.focus();
  }, [state]);

  const fieldError = (name: string) => state.fieldErrors?.[name]?.[0];

  return (
    <form action={formAction} className="space-y-4">
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="education-company-website">Company website</label>
        <input
          id="education-company-website"
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
            <p className="mt-1 text-[11.5px] leading-5 text-danger-ink/85">{state.message}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="fullName" error={fieldError("fullName")}>
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            maxLength={80}
            required
            aria-invalid={Boolean(fieldError("fullName"))}
            placeholder="Your name"
          />
        </Field>
        <Field label="Work email" htmlFor="education-email" error={fieldError("email")}>
          <Input
            id="education-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={160}
            required
            aria-invalid={Boolean(fieldError("email"))}
            placeholder="you@practice.example"
          />
        </Field>
        <Field label="Phone" htmlFor="education-phone" optional error={fieldError("phone")}>
          <Input
            id="education-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={24}
            aria-invalid={Boolean(fieldError("phone"))}
          />
        </Field>
        <Field label="City" htmlFor="education-city" optional error={fieldError("city")}>
          <Select id="education-city" name="city" defaultValue="">
            <option value="">Prefer not to say</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Your role" htmlFor="role" error={fieldError("role")}>
          <Select
            id="role"
            name="role"
            required
            defaultValue=""
            aria-invalid={Boolean(fieldError("role"))}
          >
            <option value="" disabled>
              Choose your role
            </option>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Organisation"
          htmlFor="organisation"
          optional
          error={fieldError("organisation")}
        >
          <Input
            id="organisation"
            name="organisation"
            autoComplete="organization"
            maxLength={120}
            aria-invalid={Boolean(fieldError("organisation"))}
            placeholder="Clinic, brand or NGO"
          />
        </Field>
      </div>

      <Field label="Programme" htmlFor="programmeSlug" error={fieldError("programmeSlug")}>
        <Select
          id="programmeSlug"
          name="programmeSlug"
          required
          defaultValue={defaultProgramme ?? programmes[0]?.slug ?? ""}
          aria-invalid={Boolean(fieldError("programmeSlug"))}
        >
          {programmes.map((programme) => (
            <option key={programme.slug} value={programme.slug}>
              {programme.name} · {programme.duration}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="What would you like to make easier?"
        htmlFor="goals"
        optional
        error={fieldError("goals")}
        hint="One workflow, one content problem, or one question is plenty."
      >
        <Textarea
          id="goals"
          name="goals"
          maxLength={1000}
          aria-invalid={Boolean(fieldError("goals"))}
          placeholder="e.g. We want a calmer way to prepare clients for a first visit."
        />
      </Field>

      <ConsentField
        id="consent"
        label={
          <>
            I consent to my details being stored in this local demo so the enquiry can be reviewed.
            I understand this is a concept programme with no confirmed dates or payment, and no
            marketing email will be sent.
          </>
        }
        error={fieldError("consent")}
      />

      <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 text-[10px] leading-4 text-ink-muted">
          <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
          Stored locally. No live email or CRM sync.
        </p>
        <SubmitButton pendingLabel="Sending enquiry…">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Request programme details
        </SubmitButton>
      </div>
    </form>
  );
}
