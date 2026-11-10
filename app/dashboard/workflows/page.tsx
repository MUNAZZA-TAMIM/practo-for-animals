import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CircleDot,
  Clock3,
  MailX,
  PlayCircle,
  ServerCog,
  Workflow,
} from "lucide-react";
import { getWorkflowRuns } from "@/lib/db";
import { getIntegrationStatus } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/workspace/page-heading";
import { StatusBadge } from "@/components/workspace/status-badge";
import { formatDateTime, relativeTime, titleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Workflows",
  robots: { index: false, follow: false },
};

const filters = [
  "all",
  "provider-intake",
  "correction-review",
  "education-enquiry",
  "content-generation",
] as const;
type WorkflowFilter = (typeof filters)[number];

function subjectHref(run: {
  subjectType: string;
  subjectId: string;
}) {
  if (run.subjectType === "content_project") return `/dashboard/content/${run.subjectId}`;
  if (run.subjectType === "correction") return "/dashboard/corrections";
  if (run.subjectType === "business_enquiry") return "/dashboard/enquiries?tab=business";
  return "/dashboard/enquiries?tab=education";
}

export default async function DashboardWorkflowsPage({
  searchParams,
}: {
  searchParams: Promise<{ workflow?: string }>;
}) {
  const params = await searchParams;
  const workflow: WorkflowFilter = filters.includes(params.workflow as WorkflowFilter)
    ? (params.workflow as WorkflowFilter)
    : "all";
  const runs = await getWorkflowRuns();
  const integration = getIntegrationStatus();

  const filtered =
    workflow === "all" ? runs : runs.filter((run) => run.workflow === workflow);
  const needsAttention = runs.filter((run) => run.status === "needs_attention").length;
  const simulatedSteps = runs.reduce(
    (total, run) =>
      total + run.steps.filter((step) => step.status === "simulated").length,
    0,
  );

  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow="Automation log"
        title="Workflow runs"
        description="A transparent record of what actually ran, what was simulated, and where a human decision is still required. No n8n instance is connected in this demo."
        actions={
          <Button asChild variant="secondary" size="sm">
            <Link href="/admin">
              <ServerCog className="h-3.5 w-3.5" aria-hidden="true" />
              Integration status
            </Link>
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Recorded runs"
          value={String(runs.length).padStart(2, "0")}
          detail="Seed activity + live demo actions"
          icon={Workflow}
        />
        <SummaryCard
          label="Needs attention"
          value={String(needsAttention).padStart(2, "0")}
          detail="Human decision still pending"
          icon={CircleDot}
          highlight={needsAttention > 0}
        />
        <SummaryCard
          label="Simulated steps"
          value={String(simulatedSteps).padStart(2, "0")}
          detail="No external message was sent"
          icon={MailX}
        />
      </section>

      <div className="flex flex-wrap gap-1.5">
        {filters.map((item) => (
          <Link
            key={item}
            href={`/dashboard/workflows?workflow=${item}`}
            aria-current={workflow === item ? "page" : undefined}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[10px] font-bold transition-colors",
              workflow === item
                ? "border-forest-900 bg-forest-900 text-ivory-50"
                : "border-line bg-white-warm text-forest-800 hover:border-forest-900/25",
            )}
          >
            {item === "all" ? "All workflows" : titleCase(item)}
          </Link>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <section className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-line bg-white-warm px-6 py-14 text-center">
              <Workflow className="mx-auto h-8 w-8 text-forest-500" aria-hidden="true" />
              <p className="mt-3 text-[14px] font-bold text-forest-900">
                No runs for this workflow
              </p>
              <p className="mt-1 text-[11.5px] text-ink-muted">
                Try another filter to see the seeded workflow history.
              </p>
            </div>
          ) : (
            filtered.map((run) => (
              <article
                key={run.id}
                className="overflow-hidden rounded-[18px] border border-line bg-white-warm"
              >
                <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={run.status} className="scale-90" />
                      <span className="rounded-full bg-ivory-100 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                        {titleCase(run.workflow)}
                      </span>
                      {run.isSample ? (
                        <span className="text-[8.5px] font-bold uppercase tracking-[0.1em] text-amber-ink/70">
                          Sample run
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-[13px] font-bold text-forest-900">
                      {run.subjectLabel}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9.5px] text-ink-muted/70">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3 w-3" aria-hidden="true" />
                        {relativeTime(run.startedAt)} · {formatDateTime(run.startedAt)}
                      </span>
                      <span>
                        Mode: <span className="font-semibold">{run.mode}</span>
                      </span>
                    </p>
                  </div>
                  <Link
                    href={subjectHref(run)}
                    className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-forest-800 link-underline"
                  >
                    Open subject
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>

                <ol className="space-y-0 p-5">
                  {run.steps.map((step, index) => (
                    <li key={`${run.id}-${step.name}`} className="relative flex gap-3 pb-4 last:pb-0">
                      {index < run.steps.length - 1 ? (
                        <span
                          className="absolute left-[5px] top-3 h-full w-px bg-line"
                          aria-hidden="true"
                        />
                      ) : null}
                      <span
                        className={cn(
                          "relative mt-1 h-[11px] w-[11px] shrink-0 rounded-full border-2",
                          step.status === "completed"
                            ? "border-forest-600 bg-forest-600"
                            : step.status === "simulated"
                              ? "border-amber-ink/50 bg-amber-bg"
                              : step.status === "failed"
                                ? "border-danger-ink bg-danger-bg"
                                : "border-ink-muted/30 bg-white-warm",
                        )}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[10.5px] font-bold text-forest-900">
                            {step.name}
                          </p>
                          {step.status !== "completed" ? (
                            <StatusBadge status={step.status} className="scale-90" />
                          ) : null}
                          {step.at ? (
                            <span className="text-[8.5px] text-ink-muted/50">
                              {formatDateTime(step.at)}
                            </span>
                          ) : null}
                        </div>
                        {step.detail ? (
                          <p className="mt-0.5 text-[9.5px] leading-4 text-ink-muted">
                            {step.detail}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
                {run.error ? (
                  <p className="border-t border-danger-ink/15 bg-danger-bg px-5 py-2.5 text-[10px] text-danger-ink">
                    {run.error}
                  </p>
                ) : null}
              </article>
            ))
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-[18px] border border-line bg-forest-950 p-5 text-ivory-50">
            <div className="flex items-center gap-2">
              <ServerCog className="h-4 w-4 text-mint-300" aria-hidden="true" />
              <h2 className="text-[18px] tracking-[-0.02em] text-ivory-50">
                Automation reality
              </h2>
            </div>
            <dl className="mt-4 space-y-3">
              <IntegrationRow
                label="n8n content webhook"
                value={integration.n8nContentConfigured ? "Configured" : "Not configured"}
                configured={integration.n8nContentConfigured}
              />
              <IntegrationRow
                label="n8n lead webhook"
                value={integration.n8nLeadConfigured ? "Configured" : "Not configured"}
                configured={integration.n8nLeadConfigured}
              />
              <IntegrationRow
                label="Email delivery"
                value={integration.emailConfigured ? "Configured" : "Not configured"}
                configured={integration.emailConfigured}
              />
              <IntegrationRow
                label="Canva handoff"
                value={
                  integration.canvaTemplateConfigured
                    ? "Template URL set"
                    : "Manual export only"
                }
                configured={integration.canvaTemplateConfigured}
              />
            </dl>
            <p className="mt-4 border-t border-ivory-50/10 pt-3 text-[9px] leading-4 text-ivory-50/40">
              Workflow records are written before any optional automation. A
              failure cannot erase a public submission. Steps marked “simulated”
              were not executed.
            </p>
          </section>

          <section className="rounded-[18px] border border-line bg-white-warm p-5">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-forest-600" aria-hidden="true" />
              <h2 className="text-[18px] tracking-[-0.02em]">Importable workflows</h2>
            </div>
            <p className="mt-2 text-[10px] leading-5 text-ink-muted">
              Two n8n workflow definitions ship in the repository for a future
              live integration:
            </p>
            <ul className="mt-3 space-y-2 text-[10px] text-ink-muted">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral-500" />
                <code className="text-[9.5px] text-forest-800">workflows/content-generation.json</code>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral-500" />
                <code className="text-[9.5px] text-forest-800">workflows/lead-intake.json</code>
              </li>
            </ul>
            <p className="mt-4 border-t border-line pt-3 text-[9px] leading-4 text-ink-muted/60">
              These files are not executed by this deployment. See{" "}
              <span className="font-semibold text-forest-800">docs/AI_WORKFLOWS.md</span>{" "}
              for the contracts.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  icon: Icon,
  highlight = false,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Workflow;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] border p-5",
        highlight ? "border-amber-ink/20 bg-amber-bg" : "border-line bg-white-warm",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-ink-muted/60">
          {label}
        </p>
        <Icon className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
      </div>
      <p className="mt-3 font-display text-[34px] leading-none tracking-[-0.04em] text-forest-900">
        {value}
      </p>
      <p className="mt-2 text-[9.5px] text-ink-muted/65">{detail}</p>
    </div>
  );
}

function IntegrationRow({
  label,
  value,
  configured,
}: {
  label: string;
  value: string;
  configured: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[9.5px] text-ivory-50/55">{label}</dt>
      <dd
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[8.5px] font-bold",
          configured
            ? "bg-mint-300/15 text-mint-200"
            : "bg-coral-500/15 text-coral-300",
        )}
      >
        <span
          className={cn(
            "h-1 w-1 rounded-full",
            configured ? "bg-mint-300" : "bg-coral-300",
          )}
          aria-hidden="true"
        />
        {value}
      </dd>
    </div>
  );
}
