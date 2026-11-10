"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function LoadMoreButton({
  page,
  params,
}: {
  page: number;
  params: Record<string, string | string[] | undefined>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", String(page + 1));
    const query = next.toString();
    router.push(query ? `/find?${query}` : "/find", { scroll: false });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-forest-primary bg-forest-primary px-6 py-3 text-[13px] font-semibold text-ivory-warm transition-colors hover:bg-forest-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-accent"
    >
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
      Load more providers
    </button>
  );
}
