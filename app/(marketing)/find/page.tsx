import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, SearchX, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResultsHeader } from "@/components/search/SearchResultsHeader";
import { ActiveFilters } from "@/components/search/ActiveFilters";
import { SearchProviderCard } from "@/components/search/SearchProviderCard";
import { EmptyState } from "@/components/search/ProviderGrid";
import { LoadMoreButton } from "@/components/search/LoadMoreButton";
import { DirectoryFilters } from "@/components/directory/directory-filters";
import { SortSelect } from "@/components/directory/sort-select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { activeFilterLabels, filterProviders, parseDirectoryParams } from "@/lib/data/directory";
import {
  PROVIDER_CATEGORIES,
  providers,
} from "@/lib/data/providers";
import { siteConfig } from "@/lib/site";

const RESULTS_PER_PAGE = 6;

export const metadata: Metadata = {
  title: "Find animal care",
  description:
    "Search sample veterinary clinics, hospitals, diagnostics, grooming, boarding, rescue and equine providers across India.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FindPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const params = parseDirectoryParams(rawParams);
  const pageNum = Math.max(1, Number(rawParams.page ?? 1));

  const allResults = filterProviders(providers, params);
  const paginatedResults = allResults.slice(0, pageNum * RESULTS_PER_PAGE);
  const hasMore = paginatedResults.length < allResults.length;
  const activeFilters = activeFilterLabels(params);

  return (
    <>
      <PageHero
        eyebrow="The care directory"
        title={
          <>
            The right care is easier to find when the{" "}
            <span className="display-italic text-coral-600">details</span> are up front.
          </>
        }
        description="Search by care type, city, species or practical need. Every profile brings services, hours, facilities and contact details into one considered view."
        breadcrumbs={[{ href: "/find", label: "Find care" }]}
        aside={
          <div className="rounded-[20px] border border-line bg-white-warm p-5 shadow-[0_22px_50px_-42px_rgba(13,43,35,0.4)]">
            <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-forest-900">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                Sample directory
              </p>
              <Badge variant="sample">Illustrative</Badge>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <dt className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                  Providers
                </dt>
                <dd className="mt-1 font-display text-[27px] leading-none text-forest-900">
                  {providers.length}
                </dd>
              </div>
              <div>
                <dt className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                  Cities
                </dt>
                <dd className="mt-1 font-display text-[27px] leading-none text-forest-900">
                  {new Set(providers.map((p) => p.city)).size}
                </dd>
              </div>
              <div>
                <dt className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                  Care types
                </dt>
                <dd className="mt-1 font-display text-[27px] leading-none text-forest-900">
                  {PROVIDER_CATEGORIES.length}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-[10.5px] leading-4 text-ink-muted">
              No real businesses, verification, ratings, rankings or partnerships are represented.
            </p>
          </div>
        }
      />

      {/* Section 02 — Prominent search bar */}
      <SearchBar
        initialParams={{
          q: params.q,
          city: params.city,
          type: params.type,
          species: params.species,
        }}
        defaultResults={allResults.length}
      />

      {/* Section 03 — Results header */}
      <SearchResultsHeader
        params={params}
        resultCount={allResults.length}
      />

      {activeFilters.length > 0 && (
        <ActiveFilters
          params={params}
          filters={activeFilters.map((f) => ({
            key: f.key,
            label: f.label,
            value: f.label,
          }))}
        />
      )}

      {/* Filter sidebar + results grid */}
      <section className="section-pad">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
            {/* Desktop filter sidebar */}
            <aside className="sticky top-24 hidden lg:block">
              <DirectoryFilters params={params} resultCount={allResults.length} />
            </aside>

            <div>
              {/* Results count + sort */}
              <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest-700">
                    {allResults.length} sample provider{allResults.length === 1 ? "" : "s"}
                  </p>
                  <h2 className="mt-1.5 font-display text-[30px] leading-tight tracking-[-0.03em] text-forest-900">
                    {params.type
                      ? PROVIDER_CATEGORIES.find((item) => item.value === params.type)?.label
                      : "Care across the directory"}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <SortSelect value={params.sort} />
                </div>
              </div>

              {/* Results grid or empty state */}
              {allResults.length === 0 ? (
                <EmptyState
                  title="No providers found."
                  description="Try changing your location or adjusting your filters."
                  ctaLabel="Clear filters"
                  ctaHref="/find"
                  icon={<SearchX className="h-6 w-6" aria-hidden="true" />}
                />
              ) : (
                <>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
                    {paginatedResults.map((provider, index) => (
                      <SearchProviderCard
                        key={provider.slug}
                        provider={provider}
                        priority={index < 2 && pageNum === 1}
                      />
                    ))}
                  </div>

                  {hasMore ? (
                    <div className="mt-10 flex justify-center">
                      <LoadMoreButton page={pageNum} params={rawParams} />
                    </div>
                  ) : (
                    <div className="mt-8 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted/60">
                      All {allResults.length} results shown
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter trigger (shown below results on mobile) */}
      <div className="lg:hidden border-t border-line/70 bg-ivory-50/50">
        <div className="container-page py-8">
          <DirectoryFilters params={params} resultCount={allResults.length} />
        </div>
      </div>

      {/* Section 08-ish — CTA strip */}
      <section className="border-t border-line bg-ivory-100/60">
        <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-900 text-ivory-50">
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-[24px] leading-tight tracking-[-0.02em] text-forest-900">
                Missing a practice you know?
              </p>
              <p className="mt-1 text-[12px] leading-5 text-ink-muted">
                Provider submissions are reviewed before anything is prepared for publication.
              </p>
            </div>
          </div>
          <Button asChild variant="secondary">
            <Link href="/list-business">
              Prepare a listing
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}


