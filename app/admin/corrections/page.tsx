import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FilePenLine,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { getCorrections, getProviderBySlug } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/workspace/page-heading";
import { StatusBadge } from "@/components/workspace/status-badge";
import { correctionDecisionAction } from "@/app/admin/actions";
import { formatDateTime, relativeTime, titleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";

const filters = ["all", "pending", "approved", "rejected"] as const;
type CorrectionFilter = (typeof filters)[number];

export default async function AdminCorrectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string; status?: string }>;
}) {
  const params = await searchParams;
  const status: CorrectionFilter = filters.includes(params.status as CorrectionFilter)
    ? (params.status as CorrectionFilter)
    : "all";
  const corrections = await getCorrections();

  const filtered = corrections.filter((item) => {
    if (status === "all") return true;
    return item.status === status;
  });

  const counts = {
    all: corrections.length,
    pending: corrections.filter((item) => item.status === "pending").length,
    approved: corrections.filter((item) => item.status === "approved").length,
    rejected: corrections.filter((item) => item.status === "rejected").length,
  };

  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow="Corrections"
        title="Correction queue"
        description="Compare current and proposed provider information. Approval updates the sample provider record and is recorded against your name; rejection leaves the record untouched."
        actions={
          <>
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin">
                Back to overview
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {filters.map((item) => {
          const active = status === item;
          return (
            <Link
              key={item}
              href={`/admin/corrections?status=${item}`}
              aria-current={status === item ? "page" : undefined}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[10.5px] font-bold transition-colors",
                status === item
                  ? "border-forest-900 bg-forest-900 text-ivory-50"
                  : "border-line bg-white-warm text-forest-800 hover:border-forest-900/25",
              )}
            >
              {item === "all" ? "All" : titleCase(item)}
              <span className="ml-1.5 opacity-60">{counts[item]}</span>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-line bg-white-warm px-6 py-14 text-center">
          <FilePenLine className="mx-auto h-8 w-8 text-forest-500" aria-hidden="true" />
          <p className="mt-3 text-[14px] font-bold text-forest-900">
            Nothing in this view
          </p>
          <p className="mt-1 text-[11.5px] text-ink-muted">
            Corrections appear here as soon as a visitor submits one.
          </p>
          <Button asChild variant="secondary" size="sm" className="mt-4">
            <Link href="/admin/corrections?status=all">Show all corrections</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((correction) => (
            <li
              key={correction.id}
              className="overflow-hidden rounded-[18px] border border-line bg-white-warm"
            >
              <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[15px] font-bold text-forest-900">
                      {correction.providerName}
                    </h2>
                    <StatusBadge status={correction.status} className="scale-90" />
                    {correction.isSample ? (
                      <span className="text-[8.5px] font-bold uppercase tracking-[0.1em] text-amber-ink/70">
                        Sample
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-ink-muted">
                    <span className="rounded-full bg-ivory-100 px-2 py-0.5 font-bold uppercase tracking-[0.1em] text-forest-800">
                      {titleCase(correction.field)}
                    </span>
                    <span className="font-mono text-[9px] text-ink-muted/50">
                      {correction.reference}
                    </span>
                    <span>{relativeTime(correction.createdAt)}</span>
                    <span>by {correction.submitterName}</span>
                  </p>
                </div>
                <Link
                  href={`/providers/${correction.providerSlug}`}
                  className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-forest-800 link-underline"
                >
                  Open listing
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid gap-px bg-line sm:grid-cols-2">
                <div className="bg-ivory-50/70 p-5">
                  <p className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.14em] text-ink-muted/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-muted/30" aria-hidden="true" />
                    Currently listed
                  </p>
                  <p className="mt-2 text-[12px] leading-6 text-ink-muted line-through decoration-ink-muted/25">
                    {correction.currentValue}
                  </p>
                </div>
                <div className="bg-mint-50 p-5">
                  <p className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.14em] text-forest-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-forest-500" aria-hidden="true" />
                    Proposed correction
                  </p>
                  <p className="mt-2 text-[12px] font-medium leading-6 text-forest-900">
                    {correction.proposedValue}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line px-5 py-3 text-[10px] text-ink-muted">
                <span>
                  Submitted by{" "}
                  <span className="font-semibold text-forest-900">
                    {correction.submitterName}
                  </span>{" "}
                  · {correction.submitterEmail}
                </span>
                {correction.evidenceUrl ? (
                  <a
                    href={correction.evidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 font-bold text-forest-800 link-underline"
                  >
                    Evidence link
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                ) : (
                  <span>No evidence link</span>
                )}
              </div>

              {correction.note ? (
                <div className="border-t border-line bg-ivory-50/50 px-5 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60">
                    Submitter note
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-ink-muted">{correction.note}</p>
                </div>
              ) : null}

              {correction.status === "pending" ? (
                <form
                  action={correctionDecisionAction}
                  className="flex flex-col gap-3 border-t border-line p-5 lg:flex-row lg:items-end"
                >
                  <input type="hidden" name="id" value={correction.id} />
                  <div className="flex-1">
                    <label
                      htmlFor={`review-note-${correction.id}`}
                      className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60"
                    >
                      Review note (optional, recommended for rejection)
                    </label>
                    <textarea
                      id={`review-note-${correction.id}`}
                      name="reviewNote"
                      rows={2}
                      maxLength={1000}
                      placeholder="What did you check before deciding?"
                      className="mt-1.5 min-h-[44px] text-[12px] w-full rounded-[10px] border border-line bg-white-warm px-3.5 py-3 text-charcoal shadow-[0_1px_2px_rgba(13,43,35,0.03)] outline-none transition-[border-color,box-shadow] hover:border-forest-900/25 focus:border-forest-700 focus:ring-4 focus:ring-forest-900/8"
                    />
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="submit"
                      name="decision"
                      value="rejected"
                      variant="danger"
                      size="sm"
                    >
                      <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      Reject
                    </Button>
                    <Button
                      type="submit"
                      name="decision"
                      value="approved"
                      size="sm"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Approve & update
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line bg-ivory-50/50 px-5 py-3 text-[10px] text-ink-muted">
                  <span className="inline-flex items-center gap-1.5 font-bold text-forest-800">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    {titleCase(correction.status)} by {correction.reviewedBy ?? "unknown"}
                  </span>
                  {correction.reviewedAt ? (
                    <span>{formatDateTime(correction.reviewedAt)}</span>
                  ) : null}
                  {correction.reviewNote ? (
                    <span className="basis-full text-[10px] leading-5">
                      “{correction.reviewNote}”
                    </span>
                  ) : null}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-start gap-2.5 rounded-xl border border-line bg-white-warm p-4">
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" aria-hidden="true" />
        <p className="text-[10px] leading-5 text-ink-muted">
          Approval edits the local demo copy of the provider record and increments
          its completeness score. No external verification is performed, and the
          public listing remains labelled as sample data.
        </p>
      </div>
    </div>
  );
}
