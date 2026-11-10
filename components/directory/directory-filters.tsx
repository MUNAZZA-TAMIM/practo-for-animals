"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FilterFields } from "./filter-fields";
import type { DirectoryParams } from "@/lib/data/directory";

export function DirectoryFilters({
  params,
  resultCount,
}: {
  params: DirectoryParams;
  resultCount: number;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="sticky top-24 hidden rounded-[18px] border border-line bg-white-warm p-5 lg:block">
        <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
          <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.13em] text-forest-900">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Refine
          </p>
          <span className="text-[10.5px] font-semibold text-ink-muted">
            {resultCount} result{resultCount === 1 ? "" : "s"}
          </span>
        </div>
        <form action="/find" method="get">
          <FilterFields params={params} idPrefix="desktop" />
        </form>
      </div>

      <div className="lg:hidden">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-forest-900/20 bg-white-warm px-4 text-[12.5px] font-semibold text-forest-900"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-forest-900 px-1.5 text-[9.5px] font-bold text-ivory-50">
                {[params.type, params.city, params.species, params.feature, params.q].filter(Boolean).length}
              </span>
            </button>
          </DialogTrigger>
          <DialogContent
            title="Refine your search"
            description={`${resultCount} sample provider${resultCount === 1 ? "" : "s"} match the current filters.`}
          >
            <form action="/find" method="get" onSubmit={() => setOpen(false)}>
              <FilterFields params={params} idPrefix="mobile" />
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
