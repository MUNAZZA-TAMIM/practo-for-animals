import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Eye,
  FileCheck2,
  Mail,
  MapPin,
  PawPrint,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { BusinessListingIntro } from "@/components/business/BusinessListingIntro";
import { BusinessFormWizard } from "@/components/business/BusinessFormWizard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "List your animal-care business",
  description:
    "Prepare a sample provider listing for the Practo for Animals concept directory. Human review before anything is published.",
};

const included = [
  "Services and species handled",
  "Opening hours and practical facilities",
  "Area, address and contact details",
  "A considered description in your own words",
];

const steps = [
  {
    title: "Share the details",
    body: "Use the form to tell us about your practice, the species you work with, and how people can reach you.",
  },
  {
    title: "A human reviews it",
    body: "The founder dashboard holds every submission for review. Nothing is published automatically, and no verification is implied.",
  },
  {
    title: "A listing is prepared",
    body: "In a live product, the next step would be a draft preview, corrections and your approval. This demo stops at the review queue.",
  },
];

export default function ListBusinessPage() {
  return (
    <>
      <BusinessListingIntro />

      <section className="border-b border-line bg-white-warm">
        <div className="container-page grid gap-px py-0 sm:grid-cols-3">
          {[
            {
              icon: Eye,
              title: "Clarity before promotion",
              body: "The listing is built around services, species, hours and practical details — not rankings.",
            },
            {
              icon: FileCheck2,
              title: "A reviewable record",
              body: "Every submission enters a founder review queue with a reference and an audit trail.",
            },
            {
              icon: ShieldCheck,
              title: "Honest by default",
              body: "Sample data is labelled. No verification, ratings, testimonials or partnerships are invented.",
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex gap-4 py-6 sm:px-6 ${index > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""}`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint-100 text-forest-800">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[12px] font-bold text-forest-900">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-ink-muted">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
            <div className="min-w-0">
              <div className="mb-7">
                <p className="kicker">Provider listing</p>
                <h2 className="mt-3 text-[36px] leading-[1.02] tracking-[-0.04em] text-forest-900 sm:text-[44px]">
                  Tell us about{" "}
                  <span className="display-italic text-forest-700">your practice.</span>
                </h2>
                <p className="mt-3 max-w-xl text-[13px] leading-6 text-ink-muted">
                  Complete the six-step form to submit your business for review.
                  This is a demonstration intake flow, not a live commercial
                  onboarding process.
                </p>
              </div>
              <div id="business-form">
                <BusinessFormWizard />
              </div>
            </div>

            <aside className="min-w-0">
              <div className="space-y-4 lg:sticky lg:top-24">
                <div
                  id="what-happens-next"
                  className="rounded-[20px] border border-line bg-forest-950 p-6 text-ivory-50"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-mint-300">
                    What happens next
                  </p>
                  <h2 className="mt-3 font-display text-[27px] leading-tight">
                    A considered path, not an instant listing.
                  </h2>
                  <ol className="mt-6 space-y-5">
                    {steps.map((step, index) => (
                      <li key={step.title} className="grid grid-cols-[26px_1fr] gap-3">
                        <span className="font-display text-[17px] leading-none text-coral-300">
                          0{index + 1}
                        </span>
                        <div>
                          <p className="text-[12px] font-bold text-ivory-50">
                            {step.title}
                          </p>
                          <p className="mt-1 text-[11px] leading-5 text-ivory-50/55">
                            {step.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-[20px] border border-line bg-white-warm p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">
                    A listing can include
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {included.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[12px] leading-5 text-forest-800">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" strokeWidth={2.4} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[20px] border border-line bg-ivory-100/70 p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white-warm text-forest-800">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="mt-3 font-display text-[22px] leading-tight text-forest-900">
                    Already listed?
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-ink-muted">
                    If you spot something wrong in a sample profile, use the
                    correction form. It follows the same human-review path.
                  </p>
                  <Link
                    href="/submit-correction"
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-forest-900 underline-offset-4 hover:underline"
                  >
                    Submit a correction
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>

                <div className="flex items-start gap-2.5 px-1 text-[10px] leading-4 text-ink-muted">
                  <Mail className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                  No marketing emails, CRM sync or live notification is configured in this demo.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ivory-100/60">
        <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-[26px] leading-tight text-forest-900">
              Want to see what a profile looks like?
            </p>
            <p className="mt-1 text-[12px] text-ink-muted">
              Open a sample listing before you submit your own details.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/providers/cedar-clover-veterinary">
              View a sample profile
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
