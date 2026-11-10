import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getEducationLeadByReference } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Enquiry received",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EducationThankYouPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const reference = Array.isArray(raw.ref) ? raw.ref[0] : raw.ref;
  const lead = reference ? await getEducationLeadByReference(reference) : null;
  const firstName = lead?.fullName.split(" ")[0];

  return (
    <>
      <section className="relative overflow-hidden bg-ivory-100">
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full border border-forest-900/[0.06]"
          aria-hidden="true"
        />
        <div className="container-page relative py-14 sm:py-20">
          {lead ? (
            <div className="mx-auto max-w-3xl">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-mint-200 text-forest-800">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </span>
              <p className="mt-7 kicker">Enquiry received</p>
              <h1 className="mt-4 text-[44px] leading-[0.98] tracking-[-0.045em] text-forest-900 sm:text-[60px]">
                Thank you{firstName ? `, ${firstName}` : ""}. Your interest is{" "}
                <span className="display-italic text-coral-600">noted.</span>
              </h1>
              <p className="mt-5 max-w-xl text-[14.5px] leading-7 text-ink-muted">
                Your programme enquiry has been stored for review. Nothing has been charged and no
                place has been reserved. This is a concept programme, so there is no confirmed
                cohort date or enrolment process yet.
              </p>

              <div className="mt-8 grid gap-4 rounded-[20px] border border-line bg-white-warm p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.15em] text-ink-muted/70">
                    Your reference
                  </p>
                  <p className="mt-1 font-display text-[30px] tracking-[0.03em] text-forest-900">
                    {lead.reference}
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-ink-muted">
                    {lead.programmeName} · {lead.fullName} · {lead.email}
                  </p>
                </div>
                <Badge variant="success" className="w-fit">
                  Stored locally
                </Badge>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[18px] border border-line bg-white-warm p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-mint-100 text-forest-800">
                    <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 font-display text-[23px] leading-tight text-forest-900">
                    What happens next
                  </h2>
                  <ul className="mt-3 space-y-2.5 text-[11.5px] leading-5 text-ink-muted">
                    <li className="flex gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-forest-600" />
                      The enquiry is reviewed as part of the demo dashboard.
                    </li>
                    <li className="flex gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-forest-600" />
                      In a live programme, cohort details would follow only once confirmed.
                    </li>
                    <li className="flex gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-forest-600" />
                      No marketing emails or sales sequence will arrive.
                    </li>
                  </ul>
                </div>

                <div className="rounded-[18px] border border-line bg-white-warm p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-coral-500/15 text-coral-ink">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 font-display text-[23px] leading-tight text-forest-900">
                    While you wait
                  </h2>
                  <p className="mt-2 text-[11.5px] leading-5 text-ink-muted">
                    Try the six-stage method for yourself. The Content Studio needs no account and
                    makes a local draft you can review and export.
                  </p>
                  <Link
                    href="/content-studio"
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-forest-900 underline-offset-4 hover:underline"
                  >
                    Open the Studio
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/education">
                    Back to the Academy
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/find">Browse animal care</Link>
                </Button>
              </div>

              <div className="mt-8 flex items-start gap-2.5 rounded-xl border border-amber-ink/15 bg-amber-bg p-4">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-ink" aria-hidden="true" />
                <p className="text-[10.5px] leading-5 text-amber-ink">
                  Please keep this reference. Because this page uses a reference lookup, anyone with
                  the link could see the details above. Do not share it publicly.
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white-warm text-forest-700">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </span>
              <h1 className="mt-6 text-[42px] leading-[1] tracking-[-0.04em] text-forest-900 sm:text-[52px]">
                We couldn’t find that{" "}
                <span className="display-italic text-coral-600">confirmation.</span>
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-[13.5px] leading-7 text-ink-muted">
                The reference may be missing or incorrect. If you just submitted an enquiry, try
                opening the confirmation link again from the same browser session. Or send a fresh
                enquiry.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/education#enquire">
                    Return to the enquiry form
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
