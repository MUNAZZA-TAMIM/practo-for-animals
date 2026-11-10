import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPublicDemoAccounts } from "@/lib/auth/demo-accounts";
import { getSession } from "@/lib/auth/session";
import { ProviderLoginFormClient } from "@/app/provider-login/login-form-client";

export const metadata: Metadata = {
  title: "Provider Sign In",
  description: "Sign in to the Practo for Animals provider workspace.",
  robots: { index: false, follow: false },
};

export default async function ProviderLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const params = await searchParams;
  const session = await getSession();

  if (session) {
    if (session.role === "provider") {
      redirect("/provider-dashboard");
    }
    redirect("/dashboard");
  }

  const notice = params.notice;

  return (
    <div className="grid min-h-dvh bg-ivory-50 lg:grid-cols-[1.02fr_0.98fr]">
      <aside className="relative hidden min-h-dvh overflow-hidden bg-forest-950 lg:block">
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-forest-950/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/35 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ivory-50 backdrop-blur-sm">
              Provider workspace
            </span>
          </div>
          <div className="max-w-lg">
            <p className="inline-flex items-center gap-2 rounded-full border border-ivory-50/20 bg-forest-950/30 px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-mint-200 backdrop-blur-sm">
              Provider access
            </p>
            <p className="mt-6 font-display text-[42px] leading-[1.01] tracking-[-0.04em] text-ivory-50 xl:text-[52px]">
              Manage your practice
            </p>
            <p className="mt-5 max-w-md text-[13.5px] leading-7 text-ivory-50/70">
              Review appointment requests, update your listing, and manage your
              services from one secure dashboard.
            </p>
            <div className="mt-8 grid gap-3 border-t border-ivory-50/15 pt-6 sm:grid-cols-2">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-mint-300" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-bold text-ivory-50">Provider dashboard</p>
                  <p className="mt-1 text-[10px] leading-5 text-ivory-50/50">
                    Manage listings, appointments, and services.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-mint-300" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-bold text-ivory-50">Human review first</p>
                  <p className="mt-1 text-[10px] leading-5 text-ivory-50/50">
                    No automated publishing, ever.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="max-w-md text-[9.5px] leading-5 text-ivory-50/35">
            Photography via Unsplash or Pexels, used illustratively. Not an
            official Practo product.
          </p>
        </div>
      </aside>
      <main className="relative flex min-h-dvh flex-col">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.18]" aria-hidden="true" />
        <div className="relative flex items-center justify-between gap-4 px-5 py-5 lg:hidden">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-ink-muted">
            Provider workspace
          </span>
        </div>
        <div className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:py-14">
          <ProviderLoginFormClient demos={getPublicDemoAccounts().filter((d) => d.role === "provider")} notice={notice} />
        </div>
        <p className="relative px-5 pb-6 text-center text-[10px] text-ink-muted/60 lg:hidden">
          Independent internship concept · Sample data · No real accounts
        </p>
      </main>
    </div>
  );
}
