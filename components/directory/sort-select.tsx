"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownWideNarrow } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/data/providers";

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-[11px] font-semibold text-ink-muted">
      <ArrowDownWideNarrow className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">Sort providers</span>
      <select
        value={value}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          if (event.target.value === "featured") {
            params.delete("sort");
          } else {
            params.set("sort", event.target.value);
          }
          const query = params.toString();
          router.push(query ? `/find?${query}` : "/find", { scroll: false });
        }}
        className="h-9 rounded-full border border-line bg-white-warm pl-3 pr-8 text-[11.5px] font-semibold text-forest-900 outline-none transition-colors hover:border-forest-900/25 focus:border-forest-700"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
