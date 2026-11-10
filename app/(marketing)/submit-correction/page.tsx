import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, ClipboardCheck, MapPin, Scale, ShieldAlert, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { CorrectionForm } from "@/components/forms/correction-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { providers } from "@/lib/data/providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Submit a correction",
  description:
    "Propose a correction to a sample provider listing. Every correction is reviewed by a human before any change is applied.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SubmitCorrectionPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const requested = Array.isArray(raw.provider) ? raw.provider[0] : raw.provider;
  const defaultProvider = providers.some((provider) => provider.slug === requested)
    ? requested
    : "";

  const providerOptions = providers.map((provider) => ({
    slug: provider.slug,
    name: provider.name,
    area: provider.area,
    city: provider.city,
    phone: provider.phone,
    address: provider.address,
    website: provider.website,
    hours: provider.hours,
    services: provider.services,
    category: provider.category,
  }));

  const provider = providers.find((p) => p.slug === defaultProvider);
  const providerSelected = Boolean(defaultProvider);

  return (
    <>
      <PageHero
        eyebrow="Keep the details honest"
        title={
          <>
            See something wrong?{" "}
            <span className="display-italic text-coral-600">Tell us.</span>
          </>
        }
        description="Corrections make a directory more useful. Share what should change and, where you can, a source. A human reviews every submission before any sample profile is updated."
        breadcrumbs={[{ href: "/submit-correction", label: "Submit a correction" }]}
        aside={
          <div className="rounded-[20px] border border-line bg-white-warm p-6">
            <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-forest-700">
                Review principles
              </p>
              <Badge variant="sample">Human review</Badge>
            </div>
            <ul className="mt-5 space-y-4">
              {[
                {
                  icon: ClipboardCheck,
                  title: "A clear comparison",
                  body: "The reviewer sees the current value and your proposed value together.",
                },
                {
                  icon: Scale,
                  title: "Evidence over assertion",
                  body: "A public source helps, but no source is required for a good-faith correction.",
                },
                {
                  icon: ShieldCheck,
                  title: "No automatic edit",
                  body: "Changes only apply after approval, with a reviewer note in the audit trail.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint-100 text-forest-800">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[11.5px] font-bold text-forest-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[10.5px] leading-5 text-ink-muted">
                        {item.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        }
      />

      <section className="section-pad">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
            <div className="min-w-0">
              <div className="mb-7">
                <p className="kicker">Correction details</p>
                <h2 className="mt-3 text-[36px] leading-[1.02] tracking-[-0.04em] text-forest-900 sm:text-[44px]">
                  Correct the record,{" "}
                  <span className="display-italic text-forest-700">not the character.</span>
                </h2>
                <p className="mt-3 max-w-xl text-[13px] leading-6 text-ink-muted">
                  Factual corrections are welcome. Please keep feedback specific to the listing and
                  avoid sharing private or clinical information.
                </p>
              </div>

              {!providerSelected && (
                <section className="rounded-[20px] border border-line bg-white-warm p-6 sm:p-8">
                  <div className="flex flex-col gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">
                      Choose a provider
                    </p>
                    <p className="mt-2 text-[12px] leading-5 text-ink-muted">
                      Select the listing whose information needs correcting.
                    </p>
                  </div>
                  <div className="mt-4 grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                    {providerOptions.map((provider) => (
                      <button
                        key={provider.slug}
                        type="button"
                        className={cn(
                          "flex flex-col items-start gap-3 rounded-[20px] border p-5 text-left transition-all",
                          defaultProvider === provider.slug
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
                      Select a provider to begin suggesting corrections.
                    </p>
                  </div>
                </section>
              )}

              {providerSelected && provider && (
                <section className="rounded-[20px] border border-line bg-white-warm p-6 sm:p-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-2">
                      <BadgeCategory category={provider.category as any} />
                      <Badge variant="sample" className="bg-ivory-50/92 text-amber-ink backdrop-blur-sm">
                        Sample listing
                      </Badge>
                    </div>
                    <h2 className="font-display text-[24px] leading-tight tracking-[-0.03em] text-forest-900 sm:text-[28px]">
                      {provider.name}
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-ink-muted">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                      {provider.area}, {provider.city}
                    </p>
                    <p className="mt-2 text-[12px] leading-5 text-ink-muted">
                      {provider.about}
                    </p>
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-[20px] border border-amber-ink/15 bg-amber-bg p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white-warm text-amber-ink">
                  <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="mt-3 font-display text-[23px] leading-tight text-amber-ink">
                  A note on sample data
                </p>
                <p className="mt-2 text-[11.5px] leading-6 text-amber-ink/85">
                  Every listing in this directory is invented for the concept. A correction can
                  improve the quality of that demo content, but it does not verify a real business
                  or make the listing live.
                </p>
              </div>

              <div className="rounded-[20px] border border-line bg-white-warm p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">
                  Before you submit
                </p>
                <ul className="mt-4 space-y-2.5 text-[11.5px] leading-5 text-ink-muted">
                  <li className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-forest-600" />
                    Choose the exact field that needs changing.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-forest-600" />
                    Describe the corrected detail, not a general complaint.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-forest-600" />
                    Link a public source only when it is relevant and safe.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-forest-600" />
                    Do not include patient records or personal health information.
                  </li>
                </ul>
              </div>

              {!providerSelected && (
                <div className="rounded-[20px] border border-line bg-ivory-100/70 p-5">
                  <p className="font-display text-[22px] leading-tight text-forest-900">
                    Need the full profile?
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-ink-muted">
                    Open a listing to see the context before proposing a change.
                  </p>
                  <Button asChild variant="secondary" size="sm" className="mt-4">
                    <Link href="/find">
                      Browse providers
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function providerSlugSelected(raw: Record<string, string | string[] | undefined>): boolean {
  const val = raw.provider;
  return Boolean(val && (Array.isArray(val) ? val[0] : val));
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
