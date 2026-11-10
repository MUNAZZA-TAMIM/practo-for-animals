import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  MessageSquareWarning,
  Palette,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  getContentProjectById,
} from "@/lib/db";
import { REVIEW_ITEMS, getDesignDirection } from "@/lib/studio/data";
import { STUDIO_AUDIENCES, STUDIO_CHANNELS, STUDIO_TONES } from "@/lib/studio/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { StatusBadge } from "@/components/workspace/status-badge";
import { SlidePreview } from "@/components/studio/slide-preview";
import { contentDecisionAction } from "@/app/dashboard/actions";
import { formatDate, formatDateTime, titleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getContentProjectById(id);
  return {
    title: project ? `Review: ${project.title}` : "Content review",
    robots: { index: false, follow: false },
  };
}

function labelFor(
  values: readonly { value: string; label: string }[],
  value: string,
) {
  return values.find((entry) => entry.value === value)?.label ?? titleCase(value);
}

export default async function ContentProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getContentProjectById(id);
  if (!project) notFound();

  const direction = getDesignDirection(project.designDirection);
  const reviewedCount = Object.values(project.review).filter(Boolean).length;
  const audience = labelFor(STUDIO_AUDIENCES, project.brief.audience);
  const channel = labelFor(STUDIO_CHANNELS, project.brief.channel);
  const tone = labelFor(STUDIO_TONES, project.brief.tone);

  return (
    <div className="space-y-7">
      <Link
        href="/dashboard/content"
        className="inline-flex items-center gap-2 text-[11px] font-semibold text-ink-muted transition-colors hover:text-forest-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to the content desk
      </Link>

      <div className="flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            {project.isSample ? (
              <span className="rounded-full bg-amber-bg px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.12em] text-amber-ink">
                Seed sample
              </span>
            ) : null}
            <span className="font-mono text-[9.5px] text-ink-muted/50">
              {project.reference}
            </span>
          </div>
          <h1 className="mt-4 text-[34px] leading-[1.02] tracking-[-0.04em] text-forest-900 sm:text-[42px]">
            {project.title}
          </h1>
          <p className="mt-3 text-[12px] leading-6 text-ink-muted">
            {project.brief.topic}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.status === "approved" ? (
            <form action={contentDecisionAction}>
              <input type="hidden" name="id" value={project.id} />
              <input type="hidden" name="decision" value="mark_exported" />
              <Button type="submit" variant="secondary" size="sm">
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                Mark exported
              </Button>
            </form>
          ) : null}
          <Button asChild variant="secondary" size="sm">
            <Link href="/content-studio">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Open studio
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_0.5fr]">
        <div className="min-w-0 space-y-5">
          <section className="rounded-[18px] border border-line bg-white-warm p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-forest-600" aria-hidden="true" />
              <h2 className="text-[20px] tracking-[-0.02em]">Brief & research</h2>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <MetaItem icon={Users} label="Audience" value={audience} />
              <MetaItem icon={Palette} label="Channel" value={channel} />
              <MetaItem icon={Sparkles} label="Tone" value={tone} />
              <MetaItem icon={FileText} label="Slides" value={`${project.slides.length}`} />
              <MetaItem icon={Palette} label="Design" value={direction.name} />
              <MetaItem
                icon={ShieldCheck}
                label="Engine"
                value={
                  project.research.engine === "n8n"
                    ? "n8n"
                    : project.research.engine === "local-fallback"
                      ? "Local fallback"
                      : "Local demo"
                }
              />
            </dl>

            <div className="mt-5 rounded-xl bg-ivory-50 p-4">
              <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-ink-muted/60">
                Research summary
              </p>
              <p className="mt-2 text-[11.5px] leading-6 text-ink-muted">
                {project.research.summary}
              </p>
              {project.research.warning ? (
                <p className="mt-3 rounded-lg border border-amber-ink/15 bg-amber-bg px-3 py-2 text-[10px] leading-5 text-amber-ink">
                  {project.research.warning}
                </p>
              ) : null}
            </div>

            <details className="group mt-4 rounded-xl border border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[10.5px] font-bold text-forest-800 transition-colors hover:bg-ivory-50">
                Full research notes
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <div className="grid gap-4 border-t border-line p-4 sm:grid-cols-2">
                <ResearchList title="Key points" items={project.research.keyPoints} />
                <ResearchList title="Cautions" items={project.research.cautions} />
                <ResearchList title="Questions readers may ask" items={project.research.questions} />
                <ResearchList title="Source checks" items={project.research.checks} />
              </div>
            </details>
          </section>

          <section className="rounded-[18px] border border-line bg-white-warm p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-forest-600" aria-hidden="true" />
                <h2 className="text-[20px] tracking-[-0.02em]">Outline</h2>
              </div>
              <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/50">
                {project.outline.length} slides
              </span>
            </div>
            <ol className="mt-4 divide-y divide-line">
              {project.outline.map((item, index) => (
                <li key={item.id} className="flex gap-3 py-3.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ivory-100 text-[9px] font-bold text-forest-800">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[12px] font-bold text-forest-900">{item.title}</p>
                    <p className="mt-1 text-[10.5px] leading-5 text-ink-muted">
                      {item.keyPoint || item.purpose}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-[18px] border border-line bg-white-warm p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-forest-600" aria-hidden="true" />
                <h2 className="text-[20px] tracking-[-0.02em]">Slide previews</h2>
              </div>
              <span className="rounded-full bg-ivory-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                {direction.name} · 4:5
              </span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.slides.map((slide, index) => (
                <div key={slide.id}>
                  <SlidePreview
                    slide={slide}
                    directionId={project.designDirection}
                    index={index}
                    total={project.slides.length}
                  />
                  <p className="mt-2 line-clamp-2 text-[9.5px] leading-4 text-ink-muted/70">
                    {slide.imageNote || "No image note recorded."}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-[18px] border border-line bg-white-warm p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[18px] tracking-[-0.02em]">Human review</h2>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[9px] font-bold",
                  reviewedCount === 6
                    ? "bg-mint-200 text-forest-800"
                    : "bg-amber-bg text-amber-ink",
                )}
              >
                {reviewedCount}/6
              </span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {REVIEW_ITEMS.map((item) => {
                const checked = project.review[item.id];
                return (
                  <li key={item.id} className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full",
                        checked
                          ? "bg-forest-900 text-ivory-50"
                          : "border border-line bg-ivory-50 text-transparent",
                      )}
                    >
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold leading-4 text-forest-900">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-[9px] leading-4 text-ink-muted/65">
                        {item.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 border-t border-line pt-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60">
                Named reviewer
              </p>
              <p className="mt-1 text-[11px] font-bold text-forest-900">
                {project.reviewerName || "Not recorded"}
              </p>
              <p className="mt-1 text-[9px] text-ink-muted/60">
                Created {formatDate(project.createdAt)} · Updated{" "}
                {formatDateTime(project.updatedAt)}
              </p>
            </div>
          </section>

          <section className="rounded-[18px] border border-line bg-forest-950 p-5 text-ivory-50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-mint-300" aria-hidden="true" />
              <h2 className="text-[18px] tracking-[-0.02em] text-ivory-50">
                Founder decision
              </h2>
            </div>
            <p className="mt-2 text-[10px] leading-5 text-ivory-50/55">
              This records a review outcome only. The copy is not published,
              scheduled, or sent to Canva automatically.
            </p>
            <form action={contentDecisionAction} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={project.id} />
              <div>
                <label
                  htmlFor="decision-note"
                  className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-ivory-50/50"
                >
                  Decision note
                </label>
                <Textarea
                  id="decision-note"
                  name="note"
                  rows={3}
                  maxLength={1000}
                  defaultValue={
                    project.status === "changes_requested" ? project.reviewNotes : ""
                  }
                  placeholder="What changed, what is still needed, or why this is approved."
                  className="mt-1.5 min-h-[72px] border-ivory-50/20 bg-ivory-50/8 text-[11.5px] text-ivory-50 placeholder:text-ivory-50/30 focus:border-mint-300 focus:ring-ivory-50/10"
                />
                <p className="mt-1 text-[8.5px] text-ivory-50/35">
                  A note of at least 5 characters is required when requesting changes.
                </p>
              </div>
              <div className="grid gap-2">
                <Button type="submit" name="decision" value="approve" variant="inverse" size="sm">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Approve content
                </Button>
                <Button
                  type="submit"
                  name="decision"
                  value="request_changes"
                  variant="outlineInverse"
                  size="sm"
                >
                  <MessageSquareWarning className="h-3.5 w-3.5" aria-hidden="true" />
                  Request changes
                </Button>
                <Button
                  type="submit"
                  name="decision"
                  value="mark_exported"
                  variant="weakness"
                  size="sm"
                  className="text-ivory-50/60 hover:bg-ivory-50/10 hover:text-ivory-50"
                >
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  Mark as exported
                </Button>
              </div>
            </form>
          </section>

          <section className="rounded-[18px] border border-line bg-white-warm p-5">
            <h2 className="text-[18px] tracking-[-0.02em]">Review notes</h2>
            {project.reviewNotes ? (
              <p className="mt-3 rounded-xl bg-ivory-50 p-3.5 text-[10.5px] leading-5 text-ink-muted">
                “{project.reviewNotes}”
              </p>
            ) : (
              <p className="mt-3 text-[10.5px] leading-5 text-ink-muted">
                No review note has been recorded yet.
              </p>
            )}
            <p className="mt-4 border-t border-line pt-3 text-[9px] leading-4 text-ink-muted/55">
              Seed projects are marked sample data. Studio-created projects are
              saved to the local JSON store when a signed-in reviewer completes
              all six checks.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-ivory-50 p-3">
      <dt className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-ink-muted/60">
        <Icon className="h-2.5 w-2.5" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 truncate text-[10.5px] font-semibold text-forest-900">{value}</dd>
    </div>
  );
}

function ResearchList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/60">
        {title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-[10px] leading-5 text-ink-muted">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-coral-500" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
