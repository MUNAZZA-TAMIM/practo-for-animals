import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { BookingWizard } from "@/components/appointments/BookingWizard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { providers, getCategoryLabel } from "@/lib/data/providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book an appointment",
  description:
    "Request an appointment with an animal-care provider. Every request is reviewed by a human before any booking is confirmed.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookAppointmentPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const requested = Array.isArray(raw.provider) ? raw.provider[0] : raw.provider;
  const provider = providers.find((p) => p.slug === requested);
  const providerSelected = Boolean(provider);

  return (
    <>
      <PageHero
        eyebrow="Book an appointment"
        title={
          <>
            Request an appointment with{" "}
            <span className="display-italic text-coral-500">
              {provider ? provider.name : "a provider"}.
            </span>
          </>
        }
        description="Tell us about your animal and when you'd like to be seen. A provider will review your request and confirm availability."
        breadcrumbs={[{ href: "/find", label: "Find care" }]}
      />

      <section className="section-pad">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
            <div className="min-w-0">
              {provider ? (
                <>
                  <div className="rounded-[20px] border border-line bg-white-warm p-6 sm:p-8 mb-8">
                    <div className="flex items-start gap-2">
                      <BadgeCategory category={provider.category as any} />
                      <Badge variant="sample" className="bg-ivory-50/92 text-amber-ink backdrop-blur-sm">
                        Sample listing
                      </Badge>
                    </div>
                    <h2 className="font-display text-[24px] leading-tight tracking-[-0.03em] text-forest-900 sm:text-[28px]">
                      {provider.name}
                    </h2>
                    <p className="mt-1 flex items-center gap-2 text-[12px] font-semibold text-ink-muted">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                      {provider.area}, {provider.city}
                    </p>
                    <p className="mt-2 text-[12px] leading-5 text-ink-muted">
                      {provider.about}
                    </p>
                  </div>
                  <BookingWizard initialProvider={provider} />
                </>
              ) : (
                <>
                  <div className="rounded-[20px] border border-line bg-white-warm p-6 sm:p-8 mb-8">
                    <div className="flex flex-col gap-3 mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">
                        Choose a provider
                      </p>
                      <p className="text-[12px] leading-5 text-ink-muted">
                        Select the practice you&rsquo;d like to request an
                        appointment with.
                      </p>
                    </div>
                    <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                      {providers.map((provider) => (
                        <button
                          key={provider.slug}
                          type="button"
                          className={cn(
                            "flex flex-col items-start gap-3 rounded-[20px] border p-5 text-left transition-all",
                            requested === provider.slug
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
                          <ArrowUpRight className="h-3 w-3 text-forest-600" aria-hidden="true" />
                        </button>
                      ))}
                      <p className="mt-4 text-[10.5px] text-ink-muted">
                        Select a provider to begin requesting an appointment.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
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
