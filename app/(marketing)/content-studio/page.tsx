import type { Metadata } from "next";
import { Check, Lock, Sparkles, Wand2 } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { StudioWizard } from "@/components/studio/studio-wizard";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Content Studio",
  description:
    "Turn one careful idea into a reviewed carousel: shape the research, edit the outline and slides, choose a design direction, and record human approval before exporting.",
};

const guarantees = [
  {
    label: "Research",
    value: "Simulated locally",
    detail: "No external model is called in this demo.",
  },
  {
    label: "Human review",
    value: "Required",
    detail: "A named reviewer confirms six checks.",
  },
  {
    label: "Publishing",
    value: "Manual",
    detail: "Exports happen on your device. Nothing auto-posts.",
  },
] as const;

export default async function ContentStudioPage() {
  const session = await getSession();

  return (
    <>
      <PageHero
        eyebrow="Content Studio"
        title={
          <>
            Make the useful thing,{" "}
            <span className="display-italic text-coral-500">
              then earn the right to publish it.
            </span>
          </>
        }
        description="A six-stage workspace for animal-health content: start with one audience and one job, shape research you can defend, edit every slide, and record human approval before anything leaves."
        breadcrumbs={[{ href: "/content-studio", label: "Content Studio" }]}
        actions={
          <>
            <a
              href="#studio"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-forest-900 px-5 text-[13px] font-semibold text-ivory-50 transition-colors hover:bg-forest-800"
            >
              <Wand2 className="h-4 w-4" aria-hidden="true" />
              Open the workspace
            </a>
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-ink-muted">
              <Sparkles className="h-3.5 w-3.5 text-coral-500" aria-hidden="true" />
              Free to try · No model credits used
            </span>
          </>
        }
        aside={
          <div className="rounded-[24px] border border-line bg-white-warm p-6 shadow-card sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-forest-700">
                The review contract
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-mint-100 text-forest-800">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </div>
            <dl className="mt-5 space-y-4">
              {guarantees.map((item) => (
                <div key={item.label} className="flex gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest-900 text-ivory-50">
                    <Check className="h-3 w-3" strokeWidth={2.8} aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="flex flex-wrap items-baseline gap-x-2 text-[12px] font-bold text-forest-900">
                      {item.label}
                      <span className="text-[10px] font-semibold text-coral-ink">
                        {item.value}
                      </span>
                    </dt>
                    <dd className="mt-1 text-[11.5px] leading-5 text-ink-muted">
                      {item.detail}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-5 border-t border-line pt-4 text-[10px] leading-5 text-ink-muted/85">
              This is a demonstrator, not a diagnosis engine. Clinical claims need
              a qualified veterinary reviewer before use.
            </p>
          </div>
        }
      />

      <section id="studio" className="section-pad bg-ivory-50">
        <div className="container-page">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kicker">The workspace</p>
              <h2 className="mt-4 text-[30px] tracking-[-0.035em] sm:text-[38px]">
                One idea, six honest stages.
              </h2>
            </div>
            <p className="max-w-sm text-[12px] leading-6 text-ink-muted">
              Your draft autosaves on this device. Saving to the review queue
              needs a demo sign-in, and exports are always available below.
            </p>
          </div>
          <StudioWizard
            signedIn={Boolean(session)}
            userName={session?.name}
          />
        </div>
      </section>
    </>
  );
}
