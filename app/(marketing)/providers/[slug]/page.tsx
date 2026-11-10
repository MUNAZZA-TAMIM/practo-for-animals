import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Accessibility,
  ArrowLeft,
  ArrowUpRight,
  Car,
  Cat,
  Check,
  ChevronRight,
  Clock3,
  HeartHandshake,
  House,
  Mail,
  MapPin,
  PawPrint,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProviderCard } from "@/components/providers/provider-card";
import { ProviderContactPanel } from "@/components/providers/ProviderContactPanel";
import { ProviderGallery } from "@/components/providers/ProviderGallery";
import {
  getCategoryLabel,
  getFeatureLabel,
  getProviderBySlug,
  providers,
  type ProviderFeature,
} from "@/lib/data/providers";

type PageProps = { params: Promise<{ slug: string }> };

const featureIcons: Record<ProviderFeature, typeof Check> = {
  "home-visits": House,
  emergency: Siren,
  "open-24-7": Clock3,
  "cat-friendly": Cat,
  accessible: Accessibility,
  parking: Car,
};

export function generateStaticParams() {
  return providers
    .filter((provider) => provider.status === "published")
    .map((provider) => ({ slug: provider.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);
  if (!provider) return { title: "Provider not found" };
  return {
    title: provider.name,
    description: `${getCategoryLabel(provider.category)} in ${provider.area}, ${provider.city}. Sample listing: ${provider.about.slice(0, 120)}`,
  };
}

export default async function ProviderProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);
  if (!provider || provider.status !== "published") notFound();

  const related = providers
    .filter(
      (candidate) =>
        candidate.slug !== provider.slug && candidate.status === "published",
    )
    .sort((a, b) => {
      const aScore =
        (a.category === provider.category ? 2 : 0) + (a.city === provider.city ? 1 : 0);
      const bScore =
        (b.category === provider.category ? 2 : 0) + (b.city === provider.city ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, 3);

  return (
    <>
      {/* Section 01 & 02 — Global header + Breadcrumb */}
      <section className="relative overflow-hidden border-b border-line bg-ivory-100">
        <div
          className="pointer-events-none absolute -right-52 -top-40 h-[36rem] w-[36rem] rounded-full border border-forest-900/[0.06]"
          aria-hidden="true"
        />
        <div className="container-page relative py-8 sm:py-10 lg:py-12">
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1.5 text-[11.5px] font-semibold text-ink-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-forest-900">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-ink-muted/50" aria-hidden="true" />
                <Link href="/find" className="transition-colors hover:text-forest-900">
                  Find care
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-ink-muted/50" aria-hidden="true" />
                <Link
                  href={`/find?type=${provider.category}`}
                  className="transition-colors hover:text-forest-900"
                >
                  {getCategoryLabel(provider.category)}
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-ink-muted/50" aria-hidden="true" />
                <span className="text-forest-900" aria-current="page">
                  {provider.name}
                </span>
              </li>
            </ol>
          </nav>

          {/* Section 03 — Provider Hero */}
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
            <div>
              <ProviderGallery provider={provider} />
              <p className="mt-2 text-[9.5px] leading-4 text-ink-muted/70">
                {provider.imageCredit}
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{getCategoryLabel(provider.category)}</Badge>
                <Badge variant="success">
                  <span className="h-1.5 w-1.5 rounded-full bg-forest-700" aria-hidden="true" />
                  Sample profile
                </Badge>
              </div>
              <h1 className="mt-5 text-[42px] leading-[0.98] tracking-[-0.045em] text-forest-900 sm:text-[54px] lg:text-[58px]">
                {provider.name}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-ink-muted">
                <MapPin className="h-4 w-4 text-forest-600" aria-hidden="true" />
                {provider.area}, {provider.city}
              </p>
              <p className="mt-5 max-w-xl text-[14.5px] leading-7 text-ink-muted">
                {provider.about}
              </p>

              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-line bg-white-warm p-3.5">
                  <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-ink-muted/70">
                    <Clock3 className="h-3 w-3" aria-hidden="true" />
                    Hours
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold leading-5 text-forest-900">
                    {provider.hours}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-white-warm p-3.5">
                  <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-ink-muted/70">
                    <PawPrint className="h-3 w-3" aria-hidden="true" />
                    Species
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold leading-5 text-forest-900">
                    {provider.species.join(", ")}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-white-warm p-3.5">
                  <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-ink-muted/70">
                    <Stethoscope className="h-3 w-3" aria-hidden="true" />
                    Services
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold leading-5 text-forest-900">
                    {provider.services.length} listed
                  </p>
                </div>
              </div>

              {/* Section 06 — Primary Contact Panel (hero variant) */}
              <ProviderContactPanel provider={provider} variant="hero" />

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/submit-correction?provider=${provider.slug}`}>
                    Correct this listing
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={`/book-appointment?provider=${provider.slug}`}>
                    Request an appointment
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 07-12 — About, Services, Species, Hours, Location, Verification */}
      <section className="section-pad">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
            <div className="min-w-0">
              <div>
                <p className="kicker">About the practice</p>
                <h2 className="mt-4 max-w-2xl text-[34px] leading-[1.04] tracking-[-0.035em] text-forest-900 sm:text-[42px]">
                  The details that help you decide{" "}
                  <span className="display-italic text-forest-700">before you call.</span>
                </h2>
                <p className="mt-5 max-w-2xl text-[14px] leading-7 text-ink-muted">
                  {provider.about} This sample profile demonstrates how a provider could present
                  context, services and practical information without rankings or unverifiable
                  claims.
                </p>
              </div>

              <div className="mt-10">
                <h3 className="font-sans text-[17px] font-bold text-forest-900">
                  Services offered
                </h3>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {provider.services.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-3 rounded-xl border border-line bg-white-warm px-4 py-3"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mint-100 text-forest-800">
                        <Check className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
                      </span>
                      <span className="text-[12.5px] font-semibold text-forest-900">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="font-sans text-[17px] font-bold text-forest-900">
                    Species handled
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {provider.species.map((species) => (
                      <span
                        key={species}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ivory-50 px-3 py-1.5 text-[11px] font-semibold text-forest-800"
                      >
                        <PawPrint className="h-3 w-3" aria-hidden="true" />
                        {species}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-ink-muted">
                    Species lists are illustrative. Always confirm suitability directly with a
                    qualified provider.
                  </p>
                </div>

                <div>
                  <h3 className="font-sans text-[17px] font-bold text-forest-900">
                    Practical details
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {provider.features.map((feature) => {
                      const Icon = featureIcons[feature] ?? Check;
                      return (
                        <li
                          key={feature}
                          className="flex items-center gap-2.5 text-[12.5px] font-medium text-forest-800"
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mint-100 text-forest-700">
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                          {getFeatureLabel(feature)}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="mt-10 rounded-[18px] border border-line bg-ivory-100/60 p-6">
                <h3 className="font-sans text-[17px] font-bold text-forest-900">
                  Hours &amp; pricing
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-ink-muted/70">
                      Opening hours
                    </p>
                    <p className="mt-1.5 text-[13px] font-semibold leading-6 text-forest-900">
                      {provider.hours}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-ink-muted/70">
                      Pricing note
                    </p>
                    <p className="mt-1.5 text-[13px] leading-6 text-forest-900">
                      {provider.priceNote}
                    </p>
                  </div>
                </div>
                <p className="mt-4 border-t border-line pt-4 text-[10.5px] leading-5 text-ink-muted">
                  Availability and fees can change. In a live product, this section would carry a
                  last-updated date and a verified source. Here it remains sample information.
                </p>
              </div>

              <div className="mt-10">
                <h3 className="font-sans text-[17px] font-bold text-forest-900">
                  Neighbourhood
                </h3>
                <div className="relative mt-4 overflow-hidden rounded-[18px] border border-line bg-[#e9eee6]">
                  <div className="dot-grid absolute inset-0 opacity-50" aria-hidden="true" />
                  <div className="relative flex min-h-[230px] flex-col items-center justify-center p-8 text-center">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-forest-900 text-ivory-50 shadow-lg">
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="mt-4 font-display text-[26px] leading-tight text-forest-900">
                      {provider.area}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-ink-muted">
                      {provider.city}
                    </p>
                    <p className="mt-3 max-w-sm text-[10.5px] leading-5 text-ink-muted/80">
                      Approximate neighbourhood only. The full address and map are sample details
                      and should not be used for navigation.
                    </p>
                  </div>
                  <span className="absolute left-8 top-8 rounded-full border border-forest-900/10 bg-white-warm/70 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-forest-700">
                    Sample location
                  </span>
                </div>
              </div>
            </div>

            <aside className="min-w-0">
              <div className="space-y-4 lg:sticky lg:top-24">
                {/* Section 06 — Contact Panel (default variant) */}
                <ProviderContactPanel provider={provider} variant="default" />

                <Card className="p-5">
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-amber-ink">
                    <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                    Honest by design
                  </p>
                  <p className="mt-3 text-[11.5px] leading-5 text-ink-muted">
                    This profile is a demonstration. There is no verification badge, star rating,
                    review score, response-time claim or commercial partnership attached to it.
                  </p>
                  <Link
                    href="/privacy"
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-forest-900 underline-offset-4 hover:underline"
                  >
                    How demo data works
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </Card>

                <div className="rounded-[18px] border border-line bg-mint-100/70 p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white-warm text-coral-ink">
                    <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="mt-3 font-display text-[22px] leading-tight text-forest-900">
                    Something not right?
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-ink-muted">
                    Correction submissions are reviewed by a human before any profile changes.
                  </p>
                  <Button asChild variant="secondary" size="sm" className="mt-4">
                    <Link href={`/submit-correction?provider=${provider.slug}`}>
                      Submit a correction
                    </Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Section 13 — Related Providers */}
      <section className="border-t border-line bg-ivory-100/60">
        <div className="container-page py-12 lg:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kicker">Keep exploring</p>
              <h2 className="mt-3 font-display text-[32px] leading-tight tracking-[-0.03em] text-forest-900 sm:text-[40px]">
                Nearby options, side by side.
              </h2>
            </div>
            <Link
              href={`/find?city=${encodeURIComponent(provider.city)}`}
              className="inline-flex items-center gap-2 text-[12px] font-bold text-forest-900"
            >
              See care in {provider.city}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProviderCard key={item.slug} provider={item} />
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="secondary">
              <Link href="/find">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to the directory
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
