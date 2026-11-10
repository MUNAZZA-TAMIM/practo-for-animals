import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Check,
  Pause,
  Search,
  Star,
  StarOff,
} from "lucide-react";
import { getProviders } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/workspace/page-heading";
import { StatusBadge } from "@/components/workspace/status-badge";
import { providerModerationAction } from "@/app/dashboard/actions";
import { PROVIDER_CATEGORIES } from "@/lib/data/providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Providers",
  robots: { index: false, follow: false },
};

const statuses = ["all", "published", "paused", "draft"] as const;
type StatusFilter = (typeof statuses)[number];

function categoryLabel(value: string) {
  return (
    PROVIDER_CATEGORIES.find((category) => category.value === value)?.shortLabel ??
    value
  );
}

export default async function DashboardProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim().slice(0, 80);
  const status: StatusFilter = statuses.includes(params.status as StatusFilter)
    ? (params.status as StatusFilter)
    : "all";
  const providers = await getProviders();

  const filtered = providers.filter((provider) => {
    if (status !== "all" && provider.status !== status) return false;
    if (!q) return true;
    const haystack = `${provider.name} ${provider.city} ${provider.area} ${provider.category}`.toLowerCase();
    return haystack.includes(q.toLowerCase());
  });

  const counts = {
    all: providers.length,
    published: providers.filter((item) => item.status === "published").length,
    paused: providers.filter((item) => item.status === "paused").length,
    draft: providers.filter((item) => item.status === "draft").length,
  };

  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow="Directory operations"
        title="Provider records"
        description="Moderate sample listings, keep featured placements intentional, and open the public profile to check what a visitor sees."
        actions={
          <Button asChild variant="secondary" size="sm">
            <Link href="/list-business">
              Public intake form
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-white-warm p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((item) => (
            <Link
              key={item}
              href={`/dashboard/providers?status=${item}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[10.5px] font-bold transition-colors",
                status === item
                  ? "border-forest-900 bg-forest-900 text-ivory-50"
                  : "border-line bg-ivory-50 text-forest-800 hover:border-forest-900/25",
              )}
            >
              {item === "all" ? "All" : item[0].toUpperCase() + item.slice(1)}
              <span className="ml-1.5 opacity-60">{counts[item]}</span>
            </Link>
          ))}
        </div>

        <form action="/dashboard/providers" className="flex w-full gap-2 sm:w-auto">
          {status !== "all" ? (
            <input type="hidden" name="status" value={status} />
          ) : null}
          <div className="relative flex-1 sm:w-64">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted/50"
              aria-hidden="true"
            />
            <Input
              name="q"
              defaultValue={q}
              placeholder="Search name, city, category"
              aria-label="Search providers"
              className="h-9 pl-9 text-[12px]"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-line bg-white-warm px-6 py-14 text-center">
          <Building2 className="mx-auto h-8 w-8 text-forest-500" aria-hidden="true" />
          <p className="mt-3 text-[14px] font-bold text-forest-900">No matching providers</p>
          <p className="mt-1 text-[11.5px] text-ink-muted">
            Try a different status or clear the search.
          </p>
          <Button asChild variant="secondary" size="sm" className="mt-4">
            <Link href="/dashboard/providers">Clear filters</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((provider) => (
            <li
              key={provider.id}
              className="rounded-[16px] border border-line bg-white-warm p-4 sm:flex sm:items-center sm:gap-4"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ivory-100">
                <Image
                  src={provider.image}
                  alt={provider.imageAlt}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              <div className="mt-3 min-w-0 flex-1 sm:mt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/providers/${provider.slug}`}
                    className="text-[13px] font-bold text-forest-900 link-underline"
                  >
                    {provider.name}
                  </Link>
                  <StatusBadge status={provider.status} className="scale-90" />
                  {provider.featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-bg px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-amber-ink">
                      <Star className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
                      Featured
                    </span>
                  ) : null}
                  {provider.isSample ? (
                    <span className="text-[8.5px] font-bold uppercase tracking-[0.1em] text-amber-ink/70">
                      Sample
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-[10.5px] text-ink-muted">
                  {categoryLabel(provider.category)} · {provider.area}, {provider.city} ·{" "}
                  {provider.species.slice(0, 3).join(", ")}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1 w-24 overflow-hidden rounded-full bg-ivory-200">
                    <span
                      className="block h-full rounded-full bg-forest-500"
                      style={{ width: `${provider.completeness}%` }}
                    />
                  </div>
                  <span className="text-[8.5px] font-semibold text-ink-muted/60">
                    {provider.completeness}% complete
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:mt-0 sm:justify-end">
                <form action={providerModerationAction} className="flex gap-1.5">
                  <input type="hidden" name="id" value={provider.id} />
                  {provider.status === "published" ? (
                    <Button type="submit" name="action" value="pause" variant="weakness" size="sm">
                      <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                      Pause
                    </Button>
                  ) : (
                    <Button type="submit" name="action" value="publish" variant="secondary" size="sm">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      Publish
                    </Button>
                  )}
                  <Button
                    type="submit"
                    name="action"
                    value={provider.featured ? "unfeature" : "feature"}
                    variant="weakness"
                    size="sm"
                    aria-label={provider.featured ? "Remove from featured" : "Mark as featured"}
                  >
                    {provider.featured ? (
                      <StarOff className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Star className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span className="hidden lg:inline">
                      {provider.featured ? "Unfeature" : "Feature"}
                    </span>
                  </Button>
                </form>
                <Button asChild variant="ghost" size="icon" aria-label={`Open ${provider.name} profile`}>
                  <Link href={`/providers/${provider.slug}`}>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[9.5px] leading-5 text-ink-muted/60">
        Provider status and featured changes are audited and reflected on the
        public directory immediately when the data store supports writes. All
        records are sample data; no verification is implied.
      </p>
    </div>
  );
}
