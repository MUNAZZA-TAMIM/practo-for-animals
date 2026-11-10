import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { BadgeCheck, HeartHandshake, Sparkles } from "lucide-react";
import { getPublicDemoAccounts } from "@/lib/auth/demo-accounts";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/marketing/logo";
import { safeRedirectPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to the Practo for Animals demonstration workspace with a seeded founder or administrator account.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; notice?: string }>;
}) {
  const params = await searchParams;
  const nextPath = safeRedirectPath(params.next, "/dashboard");
  const session = await getSession();

  if (session) redirect(nextPath);

  const demos = getPublicDemoAccounts();

  return (
    <div className="grid min-h-dvh bg-ivory-50 lg:grid-cols-[1.02fr_0.98fr]">
      <aside className="relative hidden min-h-dvh overflow-hidden bg-forest-950 lg:block">
        <Image
          src="/images/vet-portrait.jpg"
          alt="Veterinarian holding a calm dog in a softly lit clinic"
          fill
          priority
          sizes="(min-width: 1024px) 51vw, 0px"
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-forest-950/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/35 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="flex items-center justify-between gap-4">
            <Logo variant="light" />
            <span className="rounded-full border border-ivory-50/25 bg-forest-950/35 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-ivory-50 backdrop-blur-sm">
              Demo workspace
            </span>
          </div>

          <div className="max-w-lg">
            <p className="inline-flex items-center gap-2 rounded-full border border-ivory-50/20 bg-forest-950/30 px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-mint-200 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              The care desk
            </p>
            <p className="mt-6 font-display text-[42px] leading-[1.01] tracking-[-0.04em] text-ivory-50 xl:text-[52px]">
              A calmer view of the{" "}
              <span className="display-italic text-coral-300">work behind care.</span>
            </p>
            <p className="mt-5 max-w-md text-[13.5px] leading-7 text-ivory-50/70">
              Review provider enquiries, resolve corrections, and give every
              piece of studio content the human attention it needs — from one
              considered queue.
            </p>

            <div className="mt-8 grid gap-3 border-t border-ivory-50/15 pt-6 sm:grid-cols-2">
              <div className="flex items-start gap-2.5">
                <BadgeCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-mint-300"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-[11px] font-bold text-ivory-50">Human review first</p>
                  <p className="mt-1 text-[10px] leading-5 text-ivory-50/50">
                    No automated publishing, ever.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <HeartHandshake
                  className="mt-0.5 h-4 w-4 shrink-0 text-mint-300"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-[11px] font-bold text-ivory-50">Honest demo data</p>
                  <p className="mt-1 text-[10px] leading-5 text-ivory-50/50">
                    Sample listings, clearly labelled.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="max-w-md text-[9.5px] leading-5 text-ivory-50/35">
            Photography via Unsplash or Pexels, used illustratively. Not an
            official Practo product. No provider verification or partnership is
            claimed.
          </p>
        </div>
      </aside>

      <main className="relative flex min-h-dvh flex-col">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.18]" aria-hidden="true" />
        <div className="relative flex items-center justify-between gap-4 px-5 py-5 lg:hidden">
          <Logo />
          <span className="rounded-full border border-line bg-white-warm px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-ink-muted">
            Demo workspace
          </span>
        </div>
        <div className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:py-14">
          <LoginForm demos={demos} nextPath={nextPath} notice={params.notice} />
        </div>
        <p className="relative px-5 pb-6 text-center text-[10px] text-ink-muted/60 lg:hidden">
          Independent internship concept · Sample data · No real accounts
        </p>
      </main>
    </div>
  );
}
