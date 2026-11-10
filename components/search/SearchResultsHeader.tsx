import Link from "next/link";
import type { DirectoryParams } from "@/lib/data/directory";
import { cn } from "@/lib/utils";

export function SearchResultsHeader({
  params,
  resultCount,
}: {
  params: DirectoryParams;
  resultCount: number;
}) {
  return (
    <section className="section-pad border-t border-line/70 bg-ivory-50">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl">
            <p className="kicker">Animal care discovery</p>
            <h1 className="mt-4 text-[40px] leading-[1.01] tracking-[-0.04em] text-forest-900 sm:text-[50px]">
              Animal-care providers near you.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-ink-muted">
              Explore available services and find the right care for your animal.
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white-warm px-3 py-1.5 text-[11px] font-bold text-forest-900">
              {resultCount} sample provider{resultCount === 1 ? "" : "s"} found
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted/70">
          {params.city && (
            <span className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-full bg-forest-900 px-2 py-0.5 text-[9px] font-bold text-ivory-warm">
                <span className="h-3 w-3" />
              </span>
              {params.city}
            </span>
          )}
          {params.type && (
            <span className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-full bg-forest-900 px-2 py-0.5 text-[9px] font-bold text-ivory-warm">
                <span className="h-3 w-3" />
              </span>
              {params.type.charAt(0).toUpperCase() + params.type.slice(1)}
            </span>
          )}
          {params.species && (
            <span className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-full bg-forest-900 px-2 py-0.5 text-[9px] font-bold text-ivory-warm">
                <span className="h-3 w-3" />
              </span>
              {params.species}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
