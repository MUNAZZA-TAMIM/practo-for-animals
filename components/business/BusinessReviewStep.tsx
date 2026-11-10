"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, MapPin, Phone, Mail, Globe, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsentField } from "@/components/ui/feedback";
import { cn } from "@/lib/utils";

export type BusinessReviewStepProps = {
  data: {
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
  updateField: (key: "consent", value: boolean) => void;
};

const CATEGORY_LABELS: Record<string, string> = {
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

export function BusinessReviewStep({
  data,
  updateField,
}: BusinessReviewStepProps) {
  const fullAddress = [
    data.addressLine1,
    data.addressLine2,
    data.city,
    data.state,
    data.postalCode,
    data.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section>
      <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-ivory-50">
          06
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
            Business information
          </p>
          <p className="text-[13px] font-bold text-forest-900 mb-1">
            {data.businessName}
          </p>
          <p className="text-[12px] leading-5 text-ink-muted">
            {CATEGORY_LABELS[data.category] || data.category}
          </p>
          <p className="mt-2 text-[12px] leading-5 text-ink-muted">
            {data.description}
          </p>
        </div>

        <div className="rounded-xl border border-line bg-white-warm p-5 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700 mb-3">
            Services
          </p>
          <div className="flex flex-wrap gap-2">
            {data.services.map((service) => (
              <span key={service} className="rounded-full border border-line/80 bg-ivory-50 px-2.5 py-1 text-[10.5px] font-semibold text-forest-800">
                {service}
              </span>
            ))}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700 mt-4 mb-1">
            Animals supported
          </p>
          <div className="flex flex-wrap gap-2">
            {data.animalsSupported.map((animal) => (
              <span key={animal} className="rounded-full border border-line/80 bg-ivory-50 px-2.5 py-1 text-[10.5px] font-semibold text-forest-800">
                {animal}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white-warm p-5 sm:p-6 sm:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700 mb-3">
            Location
          </p>
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
            <p className="text-[12px] leading-5 text-ink-muted">
              {fullAddress}
            </p>
          </div>
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
                  {data.phone}
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
                  {data.email}
                </p>
              </div>
            </div>
            {data.website && (
              <div className="flex items-start gap-2.5">
                <Globe className="mt-0.5 h-3 w-3 shrink-0 text-forest-600" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                    Website
                  </p>
                  <p className="text-[12px] font-semibold text-forest-900">
                    {data.website.replace(/^https?:\/\//, "")}
                  </p>
                </div>
              </div>
            )}
            {data.contactPerson && (
              <div className="flex items-start gap-2.5">
                <PawPrint className="mt-0.5 h-3 w-3 shrink-0 text-forest-600" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                    Contact person
                  </p>
                  <p className="text-[12px] font-semibold text-forest-900">
                    {data.contactPerson}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {data.businessHours || data.additionalInformation || data.appointmentInformation || data.emergencyServiceInformation ? (
          <div className="rounded-xl border border-line bg-white-warm p-5 sm:p-6 sm:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700 mb-3">
              Additional details
            </p>
            {data.businessHours && (
              <p className="text-[12px] leading-5 text-ink-muted mb-2">
                <span className="font-bold text-forest-900">Hours:</span>{" "}
                {data.businessHours}
              </p>
            )}
            {data.additionalInformation && (
              <p className="text-[12px] leading-5 text-ink-muted mb-2">
                <span className="font-bold text-forest-900">Additional:</span>{" "}
                {data.additionalInformation}
              </p>
            )}
            {data.appointmentInformation && (
              <p className="text-[12px] leading-5 text-ink-muted mb-2">
                <span className="font-bold text-forest-900">Appointments:</span>{" "}
                {data.appointmentInformation}
              </p>
            )}
            {data.emergencyServiceInformation && (
              <p className="text-[12px] leading-5 text-ink-muted">
                <span className="font-bold text-forest-900">Emergency:</span>{" "}
                {data.emergencyServiceInformation}
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-8 rounded-xl border border-line bg-ivory-100/60 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <ConsentField
            id="consent"
            label={
              <>
                I confirm that the information provided is accurate and that I am
                authorized to submit this business listing. I understand this is a
                demonstration and no listing will be published.
              </>
            }
            error={undefined}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex-1 sm:flex-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back
        </Button>
        <Button type="submit" className="flex-1 sm:flex-1">
          Submit business listing
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
