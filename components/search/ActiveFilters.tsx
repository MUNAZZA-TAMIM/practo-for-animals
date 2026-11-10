"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { directoryHref } from "@/lib/data/directory";
import type { DirectoryParams } from "@/lib/data/directory";
import { cn } from "@/lib/utils";

type RemovableFilter = {
  key: keyof DirectoryParams;
  label: string;
  value: string;
};

const REMOVABLE_KEYS: (keyof DirectoryParams)[] = [
  "q",
  "city",
  "type",
  "species",
  "feature",
];

export function ActiveFilters({
  params,
  filters,
}: {
  params: DirectoryParams;
  filters: RemovableFilter[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRemove = React.useCallback(
    (key: keyof DirectoryParams) => {
      if (!REMOVABLE_KEYS.includes(key)) return;
      const next = new URLSearchParams(searchParams.toString());
      next.delete(key);
      // Also remove service alias if present
      next.delete("service");
      const query = next.toString();
      router.push(query ? `/find?${query}` : "/find", { scroll: false });
    },
    [router, searchParams],
  );

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted/70">
        Active
      </span>
      {filters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={() => handleRemove(filter.key)}
          className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/15 bg-mint-100 px-3 py-1 text-[10.5px] font-semibold text-forest-800 transition-colors hover:border-forest-900/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-accent"
        >
          {filter.label}
          <span
            className="text-forest-600 transition-colors hover:text-coral-ink"
            aria-hidden="true"
          >
            ×
          </span>
          <span className="sr-only">Remove {filter.label} filter</span>
        </button>
      ))}
    </div>
  );
}
