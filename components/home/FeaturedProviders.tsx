import Link from "next/link";
import { ProviderCard } from "@/components/providers/provider-card";
import {
  getProviderBySlug,
  featuredProviders,
  type Provider,
} from "@/lib/data/providers";
import { cn } from "@/lib/utils";

export function FeaturedProviders() {
  return (
    <section className="section-pad bg-ivory-100/70" id="featured">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl">
            <p className="kicker">Featured care</p>
            <h2 className="mt-4 text-[40px] leading-[1.01] tracking-[-0.04em] text-forest-900 sm:text-[50px]">
              Explore animal-care providers.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-ink-muted">
              Discover services and facilities that help animals receive the care they need.
            </p>
          </div>
          <Link
            href="/find"
            className="inline-flex items-center gap-2 text-[11px] font-bold text-forest-900 link-underline"
          >
            Explore all providers
            <span className="grid h-8 w-8 place-items-center rounded-full border border-line bg-white-warm transition-all group-hover:border-forest-900 group-hover:bg-forest-900 group-hover:text-ivory-50">
              <span className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {featuredProviders.map((provider) => (
            <ProviderCard
              key={provider.slug}
              provider={provider}
              priority={provider.slug === getProviderBySlug(provider.slug)?.slug}
            />
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-line pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted/70 max-w-xl">
            Every listing is sample data. No verification, rating, ranking or partnership is claimed.
          </p>
        </div>
      </div>
    </section>
  );
}
