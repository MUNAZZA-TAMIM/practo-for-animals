"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/login/actions";
import type { Provider } from "@/lib/data/providers";
import { ProviderNav } from "./provider-nav";
import { initials } from "@/lib/utils";

export function ProviderShell({
  provider,
  children,
}: {
  provider: Provider;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#f3eee3]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] flex-col bg-forest-950 text-ivory-50 lg:flex">
        <div className="flex items-center justify-between gap-3 border-b border-ivory-50/10 px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-mint-200 flex items-center justify-center">
              <span className="text-[10px] font-bold text-forest-950">
                {initials(provider.name)}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-mint-300/80">
                Provider workspace
              </p>
              <p className="mt-1 font-display text-[18px] leading-tight text-ivory-50">
                {provider.name}
              </p>
            </div>
          </div>
          <span className="rounded-full border border-ivory-50/15 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-ivory-50/50">
            Provider
          </span>
        </div>

        <div className="px-5 pb-4 pt-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-mint-300/80">
            Business controls
          </p>
          <p className="mt-2 text-[10px] leading-5 text-ivory-50/40">
            Manage your listing, services, and appointment requests from one
            place.
          </p>
        </div>

        <div className="mt-2 flex-1 overflow-y-auto">
          <ProviderNav provider={provider} />
        </div>

        <div className="border-t border-ivory-50/10 p-4">
          <div className="rounded-xl bg-ivory-50/6 p-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint-200 text-[10px] font-bold text-forest-950">
                {initials(provider.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11.5px] font-bold text-ivory-50">
                  {provider.name}
                </p>
                <p className="truncate text-[9px] text-ivory-50/40">
                  {provider.category}
                </p>
              </div>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold text-ivory-50/50 transition-colors hover:bg-ivory-50/10 hover:text-ivory-50"
              >
                <LogOut className="h-3 w-3" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>
          <Link
            href={`/providers/${provider.slug}`}
            className="mt-3 flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[9.5px] font-semibold text-ivory-50/35 transition-colors hover:text-ivory-50/70"
          >
            View public profile
            <span className="h-3 w-3" aria-hidden="true">→</span>
          </Link>
        </div>
      </aside>

      <div className="lg:pl-[268px]">
        <header className="sticky top-0 z-30 border-b border-line/80 bg-ivory-50/92 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <div className="h-7 w-7 rounded-full bg-mint-200 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-forest-950">
                    {initials(provider.name)}
                  </span>
                </div>
              </div>
              <span className="hidden items-center gap-2 rounded-full border border-line bg-white-warm px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-ink-muted lg:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-coral-500" aria-hidden="true" />
                Provider workspace · Sample data
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/providers/${provider.slug}`}
                className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[10.5px] font-semibold text-ink-muted transition-colors hover:bg-mint-100 hover:text-forest-900 sm:inline-flex"
              >
                View public profile
                <span className="h-3 w-3" aria-hidden="true">→</span>
              </Link>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-forest-900 text-[9px] font-bold text-ivory-50 lg:hidden">
                {initials(provider.name)}
              </span>
              <form action={logoutAction} className="lg:hidden">
                <button
                  type="submit"
                  aria-label="Sign out"
                  className="grid h-8 w-8 place-items-center rounded-full border border-line bg-white-warm text-ink-muted transition-colors hover:text-forest-900"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-line/70 px-4 py-2.5 sm:px-6 lg:hidden">
            <ProviderNav variant="mobile" provider={provider} />
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {children}
        </main>

        <footer className="border-t border-line/70 px-4 py-5 text-[10px] text-ink-muted/60 sm:px-6 lg:px-8">
          Provider workspace · Sample data · Not a production system
        </footer>
      </div>
    </div>
  );
}
