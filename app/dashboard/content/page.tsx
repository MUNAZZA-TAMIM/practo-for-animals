import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Palette,
  Plus,
  Sparkles,
} from "lucide-react";
import { getContentProjects } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/workspace/page-heading";
import { StatusBadge } from "@/components/workspace/status-badge";
import { SlidePreview } from "@/components/studio/slide-preview";
import { getDesignDirection } from "@/lib/studio/data";
import { relativeTime, titleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Content desk",
  robots: { index: false, follow: false },
};

const filters = ["all", "in_review", "changes_requested", "approved", "exported"] as const;
type ContentFilter = (typeof filters)[number];

export default async function DashboardContentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status: ContentFilter = filters.includes(params.status as ContentFilter)
    ? (params.status as ContentFilter)
    : "all";
  const projects = await getContentProjects();

  const filtered =
    status === "all" ? projects : projects.filter((item) => item.status === status);

  const counts = {
    all: projects.length,
    in_review: projects.filter((item) => item.status === "in_review").length,
    changes_requested: projects.filter((item) => item.status === "changes_requested").length,
    approved: projects.filter((item) => item.status === "approved").length,
    exported: projects.filter((item) => item.status === "exported").length,
  };

  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow="Content review"
        title="The content desk"
        description="Projects that have passed the studio's six human-review checks land here for a founder decision. Nothing is published from this queue."
        actions={
          <Button asChild size="sm">
            <Link href="/content-studio">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              New studio project
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {filters.map((item) => (
          <Link
            key={item}
            href={`/dashboard/content?status=${item}`}
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
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-line bg-white-warm px-6 py-14 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-forest-500" aria-hidden="true" />
          <p className="mt-3 text-[14px] font-bold text-forest-900">
            No projects in this view
          </p>
          <p className="mt-1 text-[11.5px] text-ink-muted">
            Complete the studio review flow to send a project here.
          </p>
          <Button asChild variant="secondary" size="sm" className="mt-4">
            <Link href="/content-studio">Open Content Studio</Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 xl:grid-cols-2">
          {filtered.map((project) => {
            const direction = getDesignDirection(project.designDirection);
            const reviewedCount = Object.values(project.review).filter(Boolean).length;
            const firstSlide = project.slides[0];
            return (
              <li
                key={project.id}
                className="card-lift group overflow-hidden rounded-[18px] border border-line bg-white-warm"
              >
                <div className="flex gap-4 p-4 sm:p-5">
                  <div className="hidden w-24 shrink-0 sm:block">
                    {firstSlide ? (
                      <SlidePreview
                        slide={firstSlide}
                        directionId={project.designDirection}
                        index={0}
                        total={project.slides.length}
                        compact
                      />
                    ) : (
                      <div className="flex aspect-[4/5] items-center justify-center rounded-lg bg-ivory-100">
                        <Palette className="h-5 w-5 text-ink-muted/40" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={project.status} className="scale-90" />
                      {project.isSample ? (
                        <span className="text-[8.5px] font-bold uppercase tracking-[0.1em] text-amber-ink/70">
                          Sample
                        </span>
                      ) : null}
                      <span className="font-mono text-[9px] text-ink-muted/50">
                        {project.reference}
                      </span>
                    </div>

                    <Link href={`/dashboard/content/${project.id}`} className="mt-2 block">
                      <h2 className="text-[18px] leading-tight tracking-[-0.02em] text-forest-900 group-hover:text-forest-700">
                        {project.title}
                      </h2>
                    </Link>
                    <p className="mt-1.5 line-clamp-2 text-[10.5px] leading-5 text-ink-muted">
                      {project.brief.topic}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9.5px] text-ink-muted/70">
                      <span className="inline-flex items-center gap-1">
                        <Palette className="h-3 w-3" aria-hidden="true" />
                        {direction.name}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Check className="h-3 w-3 text-forest-500" aria-hidden="true" />
                        {reviewedCount}/6 checks
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3 w-3" aria-hidden="true" />
                        {relativeTime(project.updatedAt)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <p className="truncate text-[9.5px] text-ink-muted/60">
                        Reviewer: {project.reviewerName || "Not recorded"}
                      </p>
                      <Link
                        href={`/dashboard/content/${project.id}`}
                        className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-forest-800 link-underline"
                      >
                        Review
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>

                {project.status === "changes_requested" && project.reviewNotes ? (
                  <div className="border-t border-line bg-danger-bg/40 px-4 py-2.5 text-[10px] leading-5 text-danger-ink sm:px-5">
                    <span className="font-bold">Changes requested: </span>
                    {project.reviewNotes}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-ivory-100/60 p-4">
        <p className="text-[10px] leading-5 text-ink-muted">
          Approving here records a founder sign-off. It does not publish or
          schedule anything. Export remains a manual studio action.
        </p>
        <Link
          href="/dashboard/workflows"
          className="inline-flex items-center gap-1 text-[10px] font-bold text-forest-800 link-underline"
        >
          View workflow history
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
