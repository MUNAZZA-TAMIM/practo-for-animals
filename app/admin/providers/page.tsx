import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  MapPin,
  PawPrint,
  ShieldAlert,
} from "lucide-react";
import { getProviders } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/workspace/page-heading";
import { providerDecisionAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import type { Provider } from "@/lib/data/providers";

const providerFilters = ["all", "published", "paused", "draft"] as const;
type ProviderFilter = (typeof providerFilters)[number];

const statusVariant: Record<
  string,
  "outline" | "warning" | "success" | "default" | "danger" | "muted" | "coral" | "forest" | "sample" | "ghostInverse"
> = {
  published: "success",
  paused: "muted",
  draft: "warning",
};

export default async function ProviderReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string; filter?: string }>;
}) {
  const { provider: providerSlug, filter: filterParam } = await searchParams;
  const providers = await getProviders();

  const status: ProviderFilter = providerFilters.includes(
    filterParam as ProviderFilter,
  )
    ? (filterParam as ProviderFilter)
    : "all";

  const filtered = providers.filter((item) => {
    if (status === "all") return true;
    return item.status === status;
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
        eyebrow="Provider reviews"
        title="Provider listings"
        description="Review and manage provider listings. Publish approved listings, pause listings that need attention, and keep drafts visible until ready."
        actions={
          <>
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin">
                Back to overview
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {providerFilters.map((item) => {
          const active = status === item;
          return (
            <Link
              key={item}
              href={`/admin/providers?filter=${item}`}
              aria-current={status === item ? "page" : undefined}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[10.5px] font-bold transition-colors",
                active
                  ? "border-forest-900 bg-forest-900 text-ivory-50"
                  : "border-line bg-white-warm text-forest-800 hover:border-forest-900/25",
              )}
            >
              {item === "all" ? "All" : item.charAt(0).toUpperCase() + item.slice(1)}
              <span className="ml-1.5 opacity-60">{counts[item]}</span>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-line bg-white-warm px-6 py-14 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-forest-500" aria-hidden="true" />
          <p className="mt-3 text-[14px] font-bold text-forest-900">
            No listings in this view
          </p>
          <p className="mt-1 text-[11.5px] text-ink-muted">
            Try a different filter or check back later.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <li className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card hover:border-forest-900/25 transition-all">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 rounded-full bg-mint-100 flex items-center justify-center">
            <PawPrint className="h-5 w-5 text-forest-800" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-[16px] leading-[1.04] tracking-[-0.02em] text-forest-900 sm:text-[18px]">
              {provider.name}
            </p>
            <p className="mt-0.5 text-[10.5px] leading-5 text-ink-muted">
              {provider.area}, {provider.city}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant[provider.status] ?? "outline"}>
            {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
          </Badge>
          <Link
            href={`/providers/${provider.slug}`}
            className="text-[10px] font-bold text-forest-800 link-underline"
          >
            View public profile
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-4">
        <div className="rounded-xl border border-line bg-white-warm p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60 mb-2">
            Category
          </p>
          <p className="text-[11px] font-semibold text-forest-900">
            {provider.category}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-white-warm p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60 mb-2">
            Hours
          </p>
          <p className="text-[11px] text-ink-muted">{provider.hours}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60">
          Services
        </p>
        <div className="flex flex-wrap gap-2">
          {provider.services.map((service) => (
            <span
              key={service}
              className="rounded-full border border-line bg-white-warm px-2.5 py-1 text-[9px] font-bold text-forest-800"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60">
          Animals treated
        </p>
        <div className="flex flex-wrap gap-2">
          {provider.species.map((species) => (
            <span
              key={species}
              className="rounded-full border border-line bg-white-warm px-2.5 py-1 text-[9px] font-bold text-forest-800"
            >
              {species}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-line">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60 mb-3">
          Review actions
        </p>
        <form action={providerDecisionAction} className="space-y-2">
          <input type="hidden" name="id" value={provider.id} />
          {provider.status === "draft" ? (
            <>
              <Button
                type="submit"
                name="action"
                value="publish"
                variant="primary"
                size="sm"
              >
                Approve & publish
              </Button>
            </>
          ) : (
            <>
              <Button
                type="submit"
                name="action"
                value={provider.status === "published" ? "pause" : "publish"}
                size="sm"
              >
                {provider.status === "published" ? "Pause listing" : "Publish listing"}
              </Button>
            </>
          )}
          <Button
            type="submit"
            name="action"
            value={provider.featured ? "unfeature" : "feature"}
            variant="outlineInverse"
            size="sm"
          >
            {provider.featured ? "Unfeature" : "Feature"}
          </Button>
        </form>
      </div>

      <div className="mt-3 text-[10px] leading-5 text-ink-muted">
        <Clock3 className="mt-0.5 h-3 w-3 shrink-0 text-ink-muted/40" aria-hidden="true" />
        <span className="ml-1">Updated {provider.updatedAt.slice(0, 10)}</span>
      </div>
    </li>
  );
}
