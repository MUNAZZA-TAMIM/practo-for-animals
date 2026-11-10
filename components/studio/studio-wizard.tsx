"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Copy,
  Download,
  ExternalLink,
  FileJson,
  FileSpreadsheet,
  FileText,
  Layers,
  LayoutList,
  Lightbulb,
  Lock,
  Palette,
  PenLine,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Trash2,
  TriangleAlert,
  Wand2,
} from "lucide-react";
import { saveStudioProject, type SaveStudioResult } from "@/app/(marketing)/content-studio/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/label";
import { Checkbox, Spinner } from "@/components/ui/feedback";
import { Input, Select, Textarea } from "@/components/ui/input";
import { SlidePreview } from "@/components/studio/slide-preview";
import {
  buildCsv,
  buildMarkdown,
  buildProjectJson,
  downloadTextFile,
  safeFilename,
} from "@/lib/studio/export";
import {
  DEFAULT_BRIEF,
  DESIGN_DIRECTIONS,
  EMPTY_REVIEW,
  IDEA_PRESETS,
  REVIEW_ITEMS,
  STUDIO_AUDIENCES,
  STUDIO_CHANNELS,
  STUDIO_DRAFT_KEY,
  STUDIO_DRAFT_TTL,
  STUDIO_SLIDE_COUNTS,
  STUDIO_TONES,
  type DesignDirectionId,
  type OutlineItem,
  type ResearchDeck,
  type ReviewChecklist,
  type ReviewItemId,
  type StudioBrief,
  type StudioSlide,
} from "@/lib/studio/data";
import {
  generateOutline,
  generateResearch,
  generateSlides,
  getThemeLabel,
} from "@/lib/studio/generator";
import type { ContentProject } from "@/lib/db/types";
import { cn, formatDateTime } from "@/lib/utils";

const STAGES = [
  {
    id: 1,
    label: "Brief",
    title: "What are we making, and why?",
    description:
      "Start with one audience and one useful job. Specific beats broad; useful beats viral.",
    icon: PenLine,
  },
  {
    id: 2,
    label: "Research",
    title: "Shape the research",
    description:
      "Look for the observations worth sharing, the claims that need care, and the questions a reader will actually have.",
    icon: Search,
  },
  {
    id: 3,
    label: "Outline",
    title: "Build the narrative",
    description:
      "Give the carousel a shape. Each slide should earn its place in the reader’s attention.",
    icon: LayoutList,
  },
  {
    id: 4,
    label: "Slides",
    title: "Edit every word",
    description:
      "The draft is yours now. Cut filler, keep the specifics, and make the next step unmistakable.",
    icon: Layers,
  },
  {
    id: 5,
    label: "Design",
    title: "Choose a direction — then review",
    description:
      "Pick a visual system and run the human review. Nothing should leave without a named reviewer.",
    icon: Palette,
  },
  {
    id: 6,
    label: "Export",
    title: "Save, export, hand off",
    description:
      "Keep the reviewed project in the workspace, download the editable copy, or prepare a Canva handoff.",
    icon: Download,
  },
] as const;

type StageId = (typeof STAGES)[number]["id"];

type SavedDraft = {
  savedAt: number;
  stage: StageId;
  maxStage: StageId;
  brief: StudioBrief;
  research: ResearchDeck | null;
  outline: OutlineItem[];
  slides: StudioSlide[];
  designDirection: DesignDirectionId;
  review: ReviewChecklist;
  reviewerName: string;
  reviewNotes: string;
  title: string;
  briefSnapshot: string;
};

type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; result: Extract<SaveStudioResult, { ok: true }> }
  | { status: "error"; message: string };

export function StudioWizard({
  signedIn,
  userName,
}: {
  signedIn: boolean;
  userName?: string;
}) {
  const [stage, setStage] = React.useState<StageId>(1);
  const [maxStage, setMaxStage] = React.useState<StageId>(1);
  const [brief, setBrief] = React.useState<StudioBrief>({ ...DEFAULT_BRIEF });
  const [research, setResearch] = React.useState<ResearchDeck | null>(null);
  const [outline, setOutline] = React.useState<OutlineItem[]>([]);
  const [slides, setSlides] = React.useState<StudioSlide[]>([]);
  const [designDirection, setDesignDirection] =
    React.useState<DesignDirectionId>("field-notes");
  const [review, setReview] = React.useState<ReviewChecklist>({ ...EMPTY_REVIEW });
  const [reviewerName, setReviewerName] = React.useState("");
  const [reviewNotes, setReviewNotes] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [briefSnapshot, setBriefSnapshot] = React.useState("");

  const [researchLoading, setResearchLoading] = React.useState(false);
  const [notice, setNotice] = React.useState("");
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [draftAvailable, setDraftAvailable] = React.useState<SavedDraft | null>(null);
  const [lastSavedAt, setLastSavedAt] = React.useState<number | null>(null);
  const [saveState, setSaveState] = React.useState<SaveState>({ status: "idle" });
  const [copied, setCopied] = React.useState(false);

  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const topRef = React.useRef<HTMLDivElement>(null);

  const currentStage = STAGES.find((item) => item.id === stage) ?? STAGES[0];
  const currentStageIndex = STAGES.findIndex((item) => item.id === stage);
  const researchStale =
    Boolean(research) && briefSnapshot !== "" && briefSnapshot !== JSON.stringify(brief);
  const reviewComplete =
    Object.values(review).every(Boolean) && reviewerName.trim().length >= 2;

  const topicValid = brief.topic.trim().length >= 8;
  const slidesValid =
    slides.length >= 4 &&
    slides.every((slide) => slide.title.trim().length > 0 && slide.body.trim().length > 0);
  const outlineValid =
    outline.length > 0 && outline.every((item) => item.title.trim().length > 0);

  const projectTitle =
    title.trim() ||
    (brief.topic.trim()
      ? brief.topic.trim().length > 64
        ? `${brief.topic.trim().slice(0, 61).trimEnd()}…`
        : brief.topic.trim()
      : "Untitled carousel");

  React.useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [stage]);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STUDIO_DRAFT_KEY);
      if (!raw) return;
      const candidate = JSON.parse(raw) as SavedDraft;
      if (
        typeof candidate?.savedAt !== "number" ||
        Date.now() - candidate.savedAt > STUDIO_DRAFT_TTL ||
        !candidate.brief ||
        typeof candidate.brief.topic !== "string"
      ) {
        window.localStorage.removeItem(STUDIO_DRAFT_KEY);
        return;
      }
      setDraftAvailable(candidate);
    } catch {
      window.localStorage.removeItem(STUDIO_DRAFT_KEY);
    }
  }, []);

  const hasContent =
    brief.topic.trim().length > 0 ||
    research !== null ||
    outline.length > 0 ||
    slides.length > 0;

  React.useEffect(() => {
    if (!hasContent) return;
    const timer = window.setTimeout(() => {
      const draft: SavedDraft = {
        savedAt: Date.now(),
        stage,
        maxStage,
        brief,
        research,
        outline,
        slides,
        designDirection,
        review,
        reviewerName,
        reviewNotes,
        title,
        briefSnapshot,
      };
      try {
        window.localStorage.setItem(STUDIO_DRAFT_KEY, JSON.stringify(draft));
        setLastSavedAt(draft.savedAt);
      } catch {
        // A full or blocked localStorage should never break the studio.
      }
    }, 650);
    return () => window.clearTimeout(timer);
  }, [
    hasContent,
    stage,
    maxStage,
    brief,
    research,
    outline,
    slides,
    designDirection,
    review,
    reviewerName,
    reviewNotes,
    title,
    briefSnapshot,
  ]);

  React.useEffect(() => {
    if (slides.length === 0) {
      setActiveSlide(0);
      return;
    }
    if (activeSlide > slides.length - 1) setActiveSlide(slides.length - 1);
  }, [activeSlide, slides.length]);

  function goTo(nextStage: StageId) {
    setStage(nextStage);
    setMaxStage((current) => (nextStage > current ? nextStage : current));
    setNotice("");
  }

  function updateBrief<K extends keyof StudioBrief>(key: K, value: StudioBrief[K]) {
    setBrief((current) => ({ ...current, [key]: value }));
  }

  function restoreDraft(draft: SavedDraft) {
    setBrief({ ...DEFAULT_BRIEF, ...draft.brief });
    setResearch(draft.research ?? null);
    setOutline(Array.isArray(draft.outline) ? draft.outline : []);
    setSlides(Array.isArray(draft.slides) ? draft.slides : []);
    setDesignDirection(draft.designDirection ?? "field-notes");
    setReview({ ...EMPTY_REVIEW, ...draft.review });
    setReviewerName(draft.reviewerName ?? "");
    setReviewNotes(draft.reviewNotes ?? "");
    setTitle(draft.title ?? "");
    setBriefSnapshot(draft.briefSnapshot ?? "");
    setStage(draft.stage >= 1 && draft.stage <= 6 ? draft.stage : 1);
    setMaxStage(
      draft.maxStage >= 1 && draft.maxStage <= 6 ? draft.maxStage : draft.stage || 1,
    );
    setDraftAvailable(null);
    setNotice("");
  }

  function discardDraft() {
    window.localStorage.removeItem(STUDIO_DRAFT_KEY);
    setDraftAvailable(null);
    setLastSavedAt(null);
  }

  async function createResearch() {
    if (!topicValid) {
      setNotice("Give the idea a little more detail — at least a short sentence.");
      return;
    }
    setNotice("");
    setResearchLoading(true);
    try {
      const response = await fetch("/api/studio/research", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(brief),
      });
      if (!response.ok) throw new Error("Research request failed");
      const payload = (await response.json()) as ResearchDeck;
      if (!payload?.summary) throw new Error("Research response was incomplete");
      setResearch(payload);
    } catch {
      const fallback = generateResearch(brief);
      setResearch({
        ...fallback,
        engine: "local-fallback",
        warning:
          "The research endpoint was unavailable, so a local demo deck was generated in the browser. No external model was called.",
      });
    } finally {
      setResearchLoading(false);
    }

    setBriefSnapshot(JSON.stringify(brief));
    setOutline([]);
    setSlides([]);
    setTitle((current) => current || projectTitle);
    goTo(2);
  }

  function buildOutline() {
    if (!research) {
      setNotice("Create a research deck before building the outline.");
      return;
    }
    if (researchStale) {
      setNotice("The brief has changed. Regenerate the research first.");
      return;
    }
    setOutline(generateOutline(brief, research));
    goTo(3);
  }

  function buildSlides() {
    if (!outlineValid) {
      setNotice("Every slide needs a title before you continue.");
      return;
    }
    const titlesMatch =
      slides.length === outline.length &&
      slides.every((slide, index) => slide.title === outline[index]?.title);
    if (!titlesMatch) {
      setSlides(generateSlides(brief, outline));
      setActiveSlide(0);
    }
    goTo(4);
  }

  function goToDesign() {
    if (!slidesValid) {
      setNotice("Every slide needs a headline and body copy before design review.");
      return;
    }
    goTo(5);
  }

  function goToExport() {
    if (!reviewComplete) {
      setNotice(
        "Confirm every review item and add the reviewer’s name before exporting the project.",
      );
      return;
    }
    goTo(6);
  }

  function next() {
    if (stage === 1) void createResearch();
    else if (stage === 2) buildOutline();
    else if (stage === 3) buildSlides();
    else if (stage === 4) goToDesign();
    else if (stage === 5) goToExport();
  }

  function updateOutline(index: number, patch: Partial<OutlineItem>) {
    setOutline((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function moveOutline(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= outline.length) return;
    setOutline((current) => {
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }

  function removeOutline(index: number) {
    if (outline.length <= 4) {
      setNotice("A carousel needs at least four slides. Add another before removing one.");
      return;
    }
    setOutline((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function addOutlineItem() {
    if (outline.length >= 10) {
      setNotice("The Studio supports a maximum of ten slides.");
      return;
    }
    setOutline((current) => [
      ...current,
      {
        id: `outline-${Date.now()}`,
        title: "",
        purpose: "Support the narrative.",
        keyPoint: "",
      },
    ]);
  }

  function updateSlide(index: number, patch: Partial<StudioSlide>) {
    setSlides((current) =>
      current.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, ...patch } : slide,
      ),
    );
  }

  function toggleReview(id: ReviewItemId) {
    setReview((current) => ({ ...current, [id]: !current[id] }));
  }

  function buildDraftProject(): ContentProject | null {
    if (!research) return null;
    const now = new Date().toISOString();
    return {
      id: "studio-draft",
      reference: "DRAFT",
      title: projectTitle,
      brief,
      research,
      outline,
      slides,
      designDirection,
      review,
      reviewerName,
      reviewNotes,
      status: "in_review",
      source: "studio",
      isSample: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  function download(format: "md" | "csv" | "json") {
    const project = buildDraftProject();
    if (!project) return;
    const name = safeFilename(projectTitle);
    if (format === "md") {
      downloadTextFile(`${name}.md`, buildMarkdown(project), "text/markdown;charset=utf-8");
    } else if (format === "csv") {
      downloadTextFile(`${name}.csv`, buildCsv(project), "text/csv;charset=utf-8");
    } else {
      downloadTextFile(
        `${name}.json`,
        buildProjectJson(project),
        "application/json;charset=utf-8",
      );
    }
  }

  async function copyMarkdown() {
    const project = buildDraftProject();
    if (!project) return;
    try {
      await navigator.clipboard.writeText(buildMarkdown(project));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handleSave() {
    if (!research) return;
    if (!reviewComplete) {
      setNotice("Complete the human review before saving.");
      return;
    }
    setSaveState({ status: "saving" });
    const result = await saveStudioProject({
      title: projectTitle,
      brief,
      research,
      outline,
      slides,
      designDirection,
      review,
      reviewerName,
      reviewNotes,
    });
    if (result.ok) {
      setSaveState({ status: "saved", result });
      window.localStorage.removeItem(STUDIO_DRAFT_KEY);
      setLastSavedAt(null);
    } else {
      setSaveState({ status: "error", message: result.error });
    }
  }

  function startNewBrief() {
    const confirmed = window.confirm(
      "Start a new brief? The current draft will be removed from this browser. Any saved project stays in the workspace.",
    );
    if (!confirmed) return;
    window.localStorage.removeItem(STUDIO_DRAFT_KEY);
    setBrief({ ...DEFAULT_BRIEF });
    setResearch(null);
    setOutline([]);
    setSlides([]);
    setDesignDirection("field-notes");
    setReview({ ...EMPTY_REVIEW });
    setReviewerName("");
    setReviewNotes("");
    setTitle("");
    setBriefSnapshot("");
    setStage(1);
    setMaxStage(1);
    setNotice("");
    setSaveState({ status: "idle" });
    setActiveSlide(0);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const nextLabel =
    stage === 1
      ? "Create research deck"
      : stage === 2
        ? "Build the outline"
        : stage === 3
          ? "Draft the slides"
          : stage === 4
            ? "Continue to design"
            : stage === 5
              ? "Review & export"
              : "Start a new brief";

  const canGoNext =
    stage === 6
      ? true
      : stage === 1
        ? topicValid
        : stage === 2
          ? Boolean(research) && !researchStale
          : stage === 3
            ? outlineValid
            : stage === 4
              ? slidesValid
              : reviewComplete;

  return (
    <div ref={topRef} className="scroll-mt-24">
      {draftAvailable ? (
        <div className="mb-4 flex flex-col gap-3 rounded-[16px] border border-forest-900/15 bg-mint-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white-warm text-forest-800">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[12px] font-bold text-forest-900">
                A saved draft is available on this device
              </p>
              <p className="mt-0.5 max-w-xl text-[10.5px] leading-5 text-forest-800/75">
                {formatDateTime(draftAvailable.savedAt)} ·{" "}
                {draftAvailable.brief.topic || "Untitled carousel"} · Stage{" "}
                {draftAvailable.stage} of 6
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" onClick={() => restoreDraft(draftAvailable)}>
              Restore draft
            </Button>
            <Button size="sm" variant="weakness" onClick={discardDraft}>
              Discard
            </Button>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[26px] border border-line bg-white-warm shadow-[0_40px_100px_-70px_rgba(13,43,35,0.5)]">
        <div className="grid lg:grid-cols-[248px_1fr]">
          <aside className="hidden bg-forest-950 text-ivory-50 lg:flex lg:flex-col">
            <div className="border-b border-ivory-50/10 p-5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-mint-300">
                Studio progress
              </p>
              <p className="mt-2 font-display text-[22px] leading-tight">
                Six stages. One reviewer.
              </p>
            </div>
            <nav aria-label="Studio stages" className="p-3">
              <ol className="space-y-1">
                {STAGES.map((item) => {
                  const complete = item.id < stage;
                  const active = item.id === stage;
                  const unlocked = item.id <= maxStage;
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        disabled={!unlocked}
                        onClick={() => goTo(item.id)}
                        aria-current={active ? "step" : undefined}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-35",
                          active
                            ? "bg-ivory-50/10 text-ivory-50"
                            : "text-ivory-50/55 hover:bg-ivory-50/6 hover:text-ivory-50",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[9px] font-bold",
                            active
                              ? "border-coral-300 bg-coral-500 text-forest-950"
                              : complete
                                ? "border-mint-300/40 bg-mint-300/15 text-mint-200"
                                : "border-ivory-50/20 text-ivory-50/50",
                          )}
                        >
                          {complete ? (
                            <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />
                          ) : (
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                        </span>
                        <span className="flex-1">
                          <span className="block text-[11.5px] font-semibold">{item.label}</span>
                          <span className="mt-0.5 block text-[9px] text-ivory-50/35">
                            Stage {item.id}
                          </span>
                        </span>
                        {active ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-coral-300" aria-hidden="true" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
            <div className="mt-auto border-t border-ivory-50/10 p-5">
              <div className="flex items-start gap-2.5">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint-300" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold text-ivory-50">Local demo generator</p>
                  <p className="mt-1 text-[9px] leading-4 text-ivory-50/40">
                    No external model call. A named human approves the output.
                  </p>
                </div>
              </div>
              {lastSavedAt ? (
                <p className="mt-4 border-t border-ivory-50/10 pt-3 text-[8.5px] uppercase tracking-[0.12em] text-ivory-50/30">
                  Autosaved locally · {formatDateTime(lastSavedAt)}
                </p>
              ) : (
                <p className="mt-4 border-t border-ivory-50/10 pt-3 text-[8.5px] uppercase tracking-[0.12em] text-ivory-50/30">
                  Drafts autosave on this device
                </p>
              )}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex items-center justify-between gap-4 border-b border-line bg-ivory-50/60 px-5 py-3.5 sm:px-7">
              <div className="flex items-center gap-2">
                <Badge variant="sample">Sample workflow</Badge>
                <span className="hidden text-[10px] text-ink-muted sm:inline">
                  Nothing publishes automatically
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-muted/60 sm:inline">
                  Stage {stage} of 6
                </span>
                {lastSavedAt ? (
                  <span className="flex items-center gap-1 text-[9.5px] font-semibold text-forest-700">
                    <Check className="h-3 w-3" aria-hidden="true" />
                    Draft saved
                  </span>
                ) : null}
              </div>
            </div>

            <div className="border-b border-line px-5 py-4 lg:hidden">
              <ol className="hide-scrollbar flex gap-1.5 overflow-x-auto">
                {STAGES.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={item.id > maxStage}
                      onClick={() => goTo(item.id)}
                      className={cn(
                        "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9.5px] font-semibold disabled:opacity-40",
                        item.id === stage
                          ? "border-forest-900 bg-forest-900 text-ivory-50"
                          : "border-line bg-white-warm text-forest-800",
                      )}
                    >
                      {item.id < stage ? (
                        <Check className="h-2.5 w-2.5" aria-hidden="true" />
                      ) : (
                        item.id
                      )}
                      {item.label}
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-5 sm:p-7 lg:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <p className="kicker">Stage {String(stage).padStart(2, "0")}</p>
                  <h2
                    ref={headingRef}
                    tabIndex={-1}
                    className="mt-3 text-[32px] leading-[1.03] tracking-[-0.035em] text-forest-900 outline-none sm:text-[38px]"
                  >
                    {currentStage.title}
                  </h2>
                  <p className="mt-2.5 text-[12.5px] leading-6 text-ink-muted">
                    {currentStage.description}
                  </p>
                </div>
                {research ? (
                  <div className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-ivory-50 px-3 py-1.5 text-[9.5px] font-semibold text-forest-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-coral-500" aria-hidden="true" />
                    {getThemeLabel(brief.topic)}
                  </div>
                ) : null}
              </div>

              {notice ? (
                <div
                  role="alert"
                  className="mt-5 flex items-start gap-2.5 rounded-xl border border-danger-ink/20 bg-danger-bg p-3.5"
                >
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger-ink" aria-hidden="true" />
                  <p className="text-[11.5px] leading-5 text-danger-ink">{notice}</p>
                </div>
              ) : null}

              <div className="mt-7">
                {stage === 1 ? (
                  <BriefStage
                    brief={brief}
                    updateBrief={updateBrief}
                    applyPreset={(preset) => {
                      setBrief((current) => ({
                        ...current,
                        topic: preset.topic,
                        goal: preset.goal,
                        audience: preset.audience,
                        tone: preset.tone,
                      }));
                      setNotice("");
                    }}
                  />
                ) : null}

                {stage === 2 && research ? (
                  <ResearchStage
                    research={research}
                    brief={brief}
                    stale={researchStale}
                    loading={researchLoading}
                    regenerate={() => void createResearch()}
                  />
                ) : null}

                {stage === 3 ? (
                  <OutlineStage
                    outline={outline}
                    updateOutline={updateOutline}
                    moveOutline={moveOutline}
                    removeOutline={removeOutline}
                    addOutlineItem={addOutlineItem}
                  />
                ) : null}

                {stage === 4 ? (
                  <SlidesStage
                    slides={slides}
                    activeSlide={activeSlide}
                    setActiveSlide={setActiveSlide}
                    updateSlide={updateSlide}
                    designDirection={designDirection}
                  />
                ) : null}

                {stage === 5 ? (
                  <DesignReviewStage
                    designDirection={designDirection}
                    setDesignDirection={setDesignDirection}
                    slides={slides}
                    review={review}
                    toggleReview={toggleReview}
                    reviewerName={reviewerName}
                    setReviewerName={setReviewerName}
                    reviewNotes={reviewNotes}
                    setReviewNotes={setReviewNotes}
                    reviewComplete={reviewComplete}
                  />
                ) : null}

                {stage === 6 ? (
                  <ExportStage
                    projectTitle={projectTitle}
                    setTitle={setTitle}
                    brief={brief}
                    research={research}
                    slides={slides}
                    outline={outline}
                    designDirection={designDirection}
                    reviewerName={reviewerName}
                    reviewNotes={reviewNotes}
                    signedIn={signedIn}
                    userName={userName}
                    saveState={saveState}
                    onSave={() => void handleSave()}
                    download={download}
                    copyMarkdown={() => void copyMarkdown()}
                    copied={copied}
                    startNewBrief={startNewBrief}
                  />
                ) : null}
              </div>

              <div className="mt-7 flex flex-col-reverse gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  {stage > 1 ? (
                    <Button
                      type="button"
                      variant="weakness"
                      onClick={() => goTo((stage - 1) as StageId)}
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Back
                    </Button>
                  ) : null}
                  {stage === 5 && !reviewComplete ? (
                    <span className="text-[10px] text-ink-muted">
                      {Object.values(review).filter(Boolean).length}/6 review items confirmed
                    </span>
                  ) : null}
                </div>

                {stage < 6 ? (
                  <Button
                    type="button"
                    onClick={next}
                    disabled={!canGoNext || researchLoading}
                    className="justify-between sm:min-w-[210px]"
                  >
                    {researchLoading ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Shaping research…
                      </>
                    ) : (
                      <>
                        {nextLabel}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={startNewBrief}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    New brief
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefStage({
  brief,
  updateBrief,
  applyPreset,
}: {
  brief: StudioBrief;
  updateBrief: <K extends keyof StudioBrief>(key: K, value: StudioBrief[K]) => void;
  applyPreset: (preset: (typeof IDEA_PRESETS)[number]) => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
      <div className="space-y-6">
        <Field
          label="The idea"
          htmlFor="studio-topic"
          hint="One clear topic. A question or specific observation usually works better than a broad theme."
        >
          <Textarea
            id="studio-topic"
            value={brief.topic}
            onChange={(event) => updateBrief("topic", event.target.value)}
            maxLength={180}
            rows={3}
            className="min-h-[104px]"
            placeholder="e.g. Itchy skin in the monsoon: what to notice before changing foods"
          />
          <div className="flex justify-end text-[9.5px] text-ink-muted/60">
            {brief.topic.length}/180
          </div>
        </Field>

        <Field
          label="What should this do?"
          htmlFor="studio-goal"
          optional
          hint="A useful job, not a vanity metric."
        >
          <Input
            id="studio-goal"
            value={brief.goal}
            onChange={(event) => updateBrief("goal", event.target.value)}
            maxLength={300}
            placeholder="Help pet parents observe the pattern and know when to ask a vet"
          />
        </Field>

        <fieldset>
          <legend className="text-[13px] font-semibold leading-5 text-forest-900">
            Who is it for?
          </legend>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {STUDIO_AUDIENCES.map((audience) => {
              const selected = brief.audience === audience.value;
              return (
                <label
                  key={audience.value}
                  className={cn(
                    "relative cursor-pointer rounded-xl border p-3.5 transition-colors",
                    selected
                      ? "border-forest-900/35 bg-mint-100"
                      : "border-line bg-white-warm hover:border-forest-900/20",
                  )}
                >
                  <input
                    type="radio"
                    name="studio-audience"
                    value={audience.value}
                    checked={selected}
                    onChange={() => updateBrief("audience", audience.value)}
                    className="sr-only"
                  />
                  <span className="flex items-start justify-between gap-3">
                    <span>
                      <span className="block text-[11.5px] font-bold text-forest-900">
                        {audience.label}
                      </span>
                      <span className="mt-1 block text-[9.5px] leading-4 text-ink-muted">
                        {audience.description}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                        selected
                          ? "border-forest-900 bg-forest-900 text-ivory-50"
                          : "border-line",
                      )}
                      aria-hidden="true"
                    >
                      {selected ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Channel" htmlFor="studio-channel">
            <Select
              id="studio-channel"
              value={brief.channel}
              onChange={(event) =>
                updateBrief("channel", event.target.value as StudioBrief["channel"])
              }
            >
              {STUDIO_CHANNELS.map((channel) => (
                <option key={channel.value} value={channel.value}>
                  {channel.label} · {channel.note}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tone" htmlFor="studio-tone">
            <Select
              id="studio-tone"
              value={brief.tone}
              onChange={(event) =>
                updateBrief("tone", event.target.value as StudioBrief["tone"])
              }
            >
              {STUDIO_TONES.map((tone) => (
                <option key={tone.value} value={tone.value}>
                  {tone.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <fieldset>
          <legend className="text-[13px] font-semibold leading-5 text-forest-900">
            How many slides?
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {STUDIO_SLIDE_COUNTS.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => updateBrief("slideCount", count)}
                aria-pressed={brief.slideCount === count}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full border text-[11.5px] font-semibold transition-colors",
                  brief.slideCount === count
                    ? "border-forest-900 bg-forest-900 text-ivory-50"
                    : "border-line bg-white-warm text-forest-800 hover:border-forest-900/25",
                )}
              >
                {count}
              </button>
            ))}
            <span className="ml-2 self-center text-[10px] text-ink-muted">
              4–10 slides · 4:5 carousel
            </span>
          </div>
        </fieldset>
      </div>

      <aside className="rounded-[16px] border border-line bg-ivory-100/60 p-4">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-coral-500/15 text-coral-ink">
            <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-forest-700">
            Need a starting point?
          </p>
        </div>
        <p className="mt-3 text-[10.5px] leading-5 text-ink-muted">
          Pick a sample brief, then make it specific to your audience.
        </p>
        <div className="mt-4 space-y-2">
          {IDEA_PRESETS.slice(0, 4).map((preset) => (
            <button
              key={preset.topic}
              type="button"
              onClick={() => applyPreset(preset)}
              className="group flex w-full items-start justify-between gap-2 rounded-lg border border-line bg-white-warm px-3 py-2.5 text-left transition-colors hover:border-forest-900/25 hover:bg-mint-50"
            >
              <span className="text-[10px] leading-4 text-forest-800">{preset.topic}</span>
              <ArrowRight
                className="mt-0.5 h-3 w-3 shrink-0 text-forest-500 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
        <p className="mt-4 border-t border-line pt-3 text-[9px] leading-4 text-ink-muted/70">
          Presets are fictional examples. No statistic, product claim, or medical advice is
          preloaded.
        </p>
      </aside>
    </div>
  );
}

function ResearchStage({
  research,
  brief,
  stale,
  loading,
  regenerate,
}: {
  research: ResearchDeck;
  brief: StudioBrief;
  stale: boolean;
  loading: boolean;
  regenerate: () => void;
}) {
  const engineLabel =
    research.engine === "n8n"
      ? "n8n research workflow"
      : research.engine === "local-fallback"
        ? "Local browser fallback"
        : "Local demo engine";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[16px] border border-line bg-ivory-50 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-900 text-ivory-50">
            <Search className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[12px] font-bold text-forest-900">{getThemeLabel(brief.topic)}</p>
              <span className="rounded-full border border-line bg-white-warm px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                {engineLabel}
              </span>
            </div>
            <p className="mt-1.5 max-w-2xl text-[11.5px] leading-6 text-ink-muted">
              {research.summary}
            </p>
          </div>
        </div>
        <Button type="button" size="sm" variant="secondary" onClick={regenerate} disabled={loading}>
          {loading ? <Spinner className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />}
          Regenerate
        </Button>
      </div>

      {stale ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-ink/15 bg-amber-bg p-3.5">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-ink" aria-hidden="true" />
          <p className="text-[11px] leading-5 text-amber-ink">
            The brief has changed since this deck was generated. Regenerate the research so the
            outline and slides do not drift from the current idea.
          </p>
        </div>
      ) : null}

      {research.warning ? (
        <p className="rounded-lg border border-line bg-white-warm px-3.5 py-2.5 text-[10px] leading-5 text-ink-muted">
          {research.warning}
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <ResearchCard title="What to notice" items={research.keyPoints} tone="mint" />
        <ResearchCard title="Handle with care" items={research.cautions} tone="amber" />
        <ResearchCard title="Questions worth answering" items={research.questions} tone="plain" />
        <ResearchCard title="Possible angles" items={research.angles} tone="plain" />
      </div>

      <div className="rounded-[14px] border border-line bg-white-warm p-4">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-forest-700">
          Source &amp; claim checks
        </p>
        <ul className="mt-3 space-y-2">
          {research.checks.map((check) => (
            <li key={check} className="flex items-start gap-2 text-[10.5px] leading-5 text-ink-muted">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral-500" aria-hidden="true" />
              {check}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-forest-700/15 bg-mint-100/70 p-3.5">
        <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" aria-hidden="true" />
        <p className="text-[10.5px] leading-5 text-forest-800">
          Research shapes the draft; it does not verify it. A qualified veterinarian still needs to
          review species-specific claims before publication.
        </p>
      </div>
    </div>
  );
}

function ResearchCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "mint" | "amber" | "plain";
}) {
  return (
    <div
      className={cn(
        "rounded-[14px] border p-4",
        tone === "mint"
          ? "border-forest-700/10 bg-mint-50"
          : tone === "amber"
            ? "border-amber-ink/15 bg-amber-bg/70"
            : "border-line bg-white-warm",
      )}
    >
      <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-forest-700">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[10.5px] leading-5 text-forest-800/85">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-forest-500" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OutlineStage({
  outline,
  updateOutline,
  moveOutline,
  removeOutline,
  addOutlineItem,
}: {
  outline: OutlineItem[];
  updateOutline: (index: number, patch: Partial<OutlineItem>) => void;
  moveOutline: (index: number, direction: -1 | 1) => void;
  removeOutline: (index: number) => void;
  addOutlineItem: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 rounded-xl border border-line bg-ivory-50 p-3.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10.5px] leading-5 text-ink-muted">
          Every slide is one idea. Titles become the headlines in the next stage.
        </p>
        <span className="shrink-0 text-[9.5px] font-bold uppercase tracking-[0.12em] text-forest-700">
          {outline.length} slides
        </span>
      </div>

      <ol className="space-y-2.5">
        {outline.map((item, index) => (
          <li key={item.id} className="rounded-[14px] border border-line bg-white-warm p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-forest-900 text-[9.5px] font-bold text-ivory-50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1 space-y-2.5">
                <Field label={`Slide ${index + 1} title`} htmlFor={`outline-title-${item.id}`}>
                  <Input
                    id={`outline-title-${item.id}`}
                    value={item.title}
                    onChange={(event) => updateOutline(index, { title: event.target.value })}
                    maxLength={140}
                    placeholder={index === 0 ? "A cover headline that earns the next swipe" : "A clear, specific headline"}
                  />
                </Field>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <Field label="Purpose" htmlFor={`outline-purpose-${item.id}`}>
                    <Input
                      id={`outline-purpose-${item.id}`}
                      value={item.purpose}
                      onChange={(event) => updateOutline(index, { purpose: event.target.value })}
                      maxLength={240}
                      placeholder="What job does this slide do?"
                    />
                  </Field>
                  <Field label="Key point" htmlFor={`outline-point-${item.id}`}>
                    <Input
                      id={`outline-point-${item.id}`}
                      value={item.keyPoint}
                      onChange={(event) => updateOutline(index, { keyPoint: event.target.value })}
                      maxLength={500}
                      placeholder="The one thing to take away"
                    />
                  </Field>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveOutline(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move slide ${index + 1} up`}
                  className="grid h-7 w-7 place-items-center rounded-md border border-line text-forest-700 transition-colors hover:bg-mint-100 disabled:opacity-30"
                >
                  <ArrowUp className="h-3 w-3" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => moveOutline(index, 1)}
                  disabled={index === outline.length - 1}
                  aria-label={`Move slide ${index + 1} down`}
                  className="grid h-7 w-7 place-items-center rounded-md border border-line text-forest-700 transition-colors hover:bg-mint-100 disabled:opacity-30"
                >
                  <ArrowDown className="h-3 w-3" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => removeOutline(index)}
                  aria-label={`Remove slide ${index + 1}`}
                  className="grid h-7 w-7 place-items-center rounded-md border border-line text-ink-muted transition-colors hover:border-danger-ink/30 hover:bg-danger-bg hover:text-danger-ink"
                >
                  <Trash2 className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <Button type="button" variant="secondary" size="sm" onClick={addOutlineItem}>
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        Add a slide
      </Button>
    </div>
  );
}

function SlidesStage({
  slides,
  activeSlide,
  setActiveSlide,
  updateSlide,
  designDirection,
}: {
  slides: StudioSlide[];
  activeSlide: number;
  setActiveSlide: (index: number) => void;
  updateSlide: (index: number, patch: Partial<StudioSlide>) => void;
  designDirection: DesignDirectionId;
}) {
  const slide = slides[activeSlide];
  if (!slide) return null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <div className="min-w-0">
        <div className="hide-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-pressed={index === activeSlide}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold transition-colors",
                index === activeSlide
                  ? "border-forest-900 bg-forest-900 text-ivory-50"
                  : "border-line bg-white-warm text-forest-800 hover:border-forest-900/25",
              )}
            >
              {String(index + 1).padStart(2, "0")}
              <span className="max-w-[84px] truncate">{item.title || "Untitled"}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-[16px] border border-line bg-white-warm p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.13em] text-coral-ink">
                Slide {String(activeSlide + 1).padStart(2, "0")}
                {activeSlide === 0 ? " · Cover" : activeSlide === slides.length - 1 ? " · Close" : ""}
              </p>
              <p className="mt-1 text-[10px] text-ink-muted">
                Edit the copy, then use the preview to check the shape.
              </p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                disabled={activeSlide === 0}
                aria-label="Previous slide"
                className="grid h-8 w-8 place-items-center rounded-full border border-line text-forest-800 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))}
                disabled={activeSlide === slides.length - 1}
                aria-label="Next slide"
                className="grid h-8 w-8 place-items-center rounded-full border border-line text-forest-800 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Kicker" htmlFor="slide-kicker" optional>
                <Input
                  id="slide-kicker"
                  value={slide.kicker}
                  onChange={(event) => updateSlide(activeSlide, { kicker: event.target.value })}
                  maxLength={100}
                  placeholder="e.g. Monsoon care"
                />
              </Field>
              <Field label="CTA" htmlFor="slide-cta" optional>
                <Input
                  id="slide-cta"
                  value={slide.cta ?? ""}
                  onChange={(event) => updateSlide(activeSlide, { cta: event.target.value })}
                  maxLength={80}
                  placeholder="e.g. Ask your vet"
                />
              </Field>
            </div>
            <Field label="Headline" htmlFor="slide-title">
              <Textarea
                id="slide-title"
                value={slide.title}
                onChange={(event) => updateSlide(activeSlide, { title: event.target.value })}
                maxLength={140}
                rows={2}
                className="min-h-[72px] text-[16px] font-semibold"
              />
            </Field>
            <Field
              label="Body copy"
              htmlFor="slide-body"
              hint="Short lines read better on a 4:5 carousel. This is general education, not veterinary advice."
            >
              <Textarea
                id="slide-body"
                value={slide.body}
                onChange={(event) => updateSlide(activeSlide, { body: event.target.value })}
                maxLength={1500}
                rows={5}
                className="min-h-[140px]"
              />
            </Field>
            <Field label="Art direction note" htmlFor="slide-image" optional>
              <Input
                id="slide-image"
                value={slide.imageNote ?? ""}
                onChange={(event) => updateSlide(activeSlide, { imageNote: event.target.value })}
                maxLength={300}
                placeholder="e.g. Calm, spacious image with room for the headline"
              />
            </Field>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[9.5px] text-ink-muted">
            {slides.length} slides · {slides.every((item) => item.title && item.body) ? "copy complete" : "some copy is incomplete"}
          </p>
          <button
            type="button"
            onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))}
            className="text-[10px] font-bold text-forest-900 underline-offset-4 hover:underline"
          >
            Next slide →
          </button>
        </div>
      </div>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-ink-muted/60">
          Live slide preview
        </p>
        <SlidePreview
          slide={slide}
          directionId={designDirection}
          index={activeSlide}
          total={slides.length}
        />
        <div className="mt-3 rounded-xl border border-line bg-ivory-50 p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-forest-700">
            A note on readability
          </p>
          <p className="mt-1.5 text-[9.5px] leading-4 text-ink-muted">
            Aim for one idea per slide and no more than about 40 words of body copy. The preview
            clips overflow; the export keeps the full text.
          </p>
        </div>
      </aside>
    </div>
  );
}

function DesignReviewStage({
  designDirection,
  setDesignDirection,
  slides,
  review,
  toggleReview,
  reviewerName,
  setReviewerName,
  reviewNotes,
  setReviewNotes,
  reviewComplete,
}: {
  designDirection: DesignDirectionId;
  setDesignDirection: (id: DesignDirectionId) => void;
  slides: StudioSlide[];
  review: ReviewChecklist;
  toggleReview: (id: ReviewItemId) => void;
  reviewerName: string;
  setReviewerName: (value: string) => void;
  reviewNotes: string;
  setReviewNotes: (value: string) => void;
  reviewComplete: boolean;
}) {
  return (
    <div className="space-y-7">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">
          Design direction
        </p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
          {DESIGN_DIRECTIONS.map((direction) => {
            const selected = designDirection === direction.id;
            return (
              <button
                key={direction.id}
                type="button"
                onClick={() => setDesignDirection(direction.id)}
                aria-pressed={selected}
                className={cn(
                  "rounded-xl border p-3.5 text-left transition-colors",
                  selected
                    ? "border-forest-900/35 bg-mint-50 ring-1 ring-forest-900/10"
                    : "border-line bg-white-warm hover:border-forest-900/20",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[11.5px] font-bold text-forest-900">{direction.name}</span>
                  <span
                    className={cn(
                      "grid h-4 w-4 place-items-center rounded-full border",
                      selected
                        ? "border-forest-900 bg-forest-900 text-ivory-50"
                        : "border-line",
                    )}
                    aria-hidden="true"
                  >
                    {selected ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
                  </span>
                </span>
                <span className="mt-1.5 block text-[9.5px] leading-4 text-ink-muted">
                  {direction.description}
                </span>
                <span className="mt-3 flex gap-1" aria-hidden="true">
                  {[
                    direction.colors.background,
                    direction.colors.ink,
                    direction.colors.accent,
                    direction.colors.surface,
                  ].map((color) => (
                    <span
                      key={color}
                      className="h-4 w-4 rounded-full border border-forest-950/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">
            Deck preview
          </p>
          <p className="text-[9.5px] text-ink-muted">
            {slides.length} slides · 4:5 · colours are illustrative
          </p>
        </div>
        <div className="hide-scrollbar -mx-1 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2">
          {slides.map((slide, index) => (
            <div key={slide.id} className="w-[220px] shrink-0 snap-start sm:w-[240px]">
              <SlidePreview
                slide={slide}
                directionId={designDirection}
                index={index}
                total={slides.length}
                compact
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[18px] border border-line bg-white-warm">
        <div className="flex flex-col gap-2 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-bold text-forest-900">Human review checklist</p>
            <p className="mt-0.5 text-[10px] text-ink-muted">
              Every item must be confirmed by the named reviewer.
            </p>
          </div>
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em]",
              reviewComplete
                ? "bg-mint-200 text-forest-800"
                : "bg-amber-bg text-amber-ink",
            )}
          >
            {reviewComplete ? (
              <>
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                Ready
              </>
            ) : (
              <>
                <TriangleAlert className="h-3 w-3" aria-hidden="true" />
                Review incomplete
              </>
            )}
          </span>
        </div>
        <div className="divide-y divide-line">
          {REVIEW_ITEMS.map((item) => (
            <label
              key={item.id}
              htmlFor={`review-${item.id}`}
              className="flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-ivory-50"
            >
              <Checkbox
                id={`review-${item.id}`}
                checked={review[item.id]}
                onChange={() => toggleReview(item.id)}
              />
              <span>
                <span className="block text-[11.5px] font-semibold text-forest-900">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-[10px] leading-4 text-ink-muted">
                  {item.detail}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Reviewer name"
          htmlFor="reviewer-name"
          hint="A named person, not a team name. This is recorded with the project."
        >
          <Input
            id="reviewer-name"
            value={reviewerName}
            onChange={(event) => setReviewerName(event.target.value)}
            maxLength={80}
            placeholder="e.g. Munazza"
          />
        </Field>
        <Field label="Review note" htmlFor="review-notes" optional>
          <Textarea
            id="review-notes"
            value={reviewNotes}
            onChange={(event) => setReviewNotes(event.target.value)}
            maxLength={1000}
            className="min-h-[96px]"
            placeholder="What changed during review? What should the next person know?"
          />
        </Field>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-forest-700/15 bg-mint-100/70 p-3.5">
        <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" aria-hidden="true" />
        <p className="text-[10.5px] leading-5 text-forest-800">
          The checklist is a thinking tool, not a guarantee. If any claim needs a veterinarian, a
          source, or a clearer escalation path, fix it before export.
        </p>
      </div>
    </div>
  );
}

function ExportStage({
  projectTitle,
  setTitle,
  brief,
  research,
  slides,
  outline,
  designDirection,
  reviewerName,
  reviewNotes,
  signedIn,
  userName,
  saveState,
  onSave,
  download,
  copyMarkdown,
  copied,
  startNewBrief,
}: {
  projectTitle: string;
  setTitle: (value: string) => void;
  brief: StudioBrief;
  research: ResearchDeck | null;
  slides: StudioSlide[];
  outline: OutlineItem[];
  designDirection: DesignDirectionId;
  reviewerName: string;
  reviewNotes: string;
  signedIn: boolean;
  userName?: string;
  saveState: SaveState;
  onSave: () => void;
  download: (format: "md" | "csv" | "json") => void;
  copyMarkdown: () => void;
  copied: boolean;
  startNewBrief: () => void;
}) {
  const direction = DESIGN_DIRECTIONS.find((item) => item.id === designDirection) ?? DESIGN_DIRECTIONS[0];

  return (
    <div className="space-y-5">
      <Field
        label="Project title"
        htmlFor="project-title"
        hint="This is how the project appears in the founder review queue."
      >
        <Input
          id="project-title"
          value={projectTitle}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={120}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Audience", value: STUDIO_AUDIENCES.find((a) => a.value === brief.audience)?.label },
          { label: "Channel", value: STUDIO_CHANNELS.find((c) => c.value === brief.channel)?.label },
          { label: "Slides", value: `${slides.length} · 4:5` },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-line bg-ivory-50 p-3.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
              {item.label}
            </p>
            <p className="mt-1.5 text-[11.5px] font-semibold text-forest-900">{item.value}</p>
          </div>
        ))}
      </div>

      {signedIn ? (
        <div className="rounded-[18px] border border-forest-700/15 bg-mint-100/70 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white-warm text-forest-800">
                <Save className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[12.5px] font-bold text-forest-900">
                  Save to the human review queue
                </p>
                <p className="mt-1 max-w-lg text-[10.5px] leading-5 text-ink-muted">
                  Signed in as {userName}. The project will appear in the founder dashboard with
                  the review checklist, not as published content.
                </p>
              </div>
            </div>
            {saveState.status === "saved" ? (
              <Badge variant="success" className="w-fit">
                Saved · {saveState.result.reference}
              </Badge>
            ) : (
              <Button
                type="button"
                onClick={onSave}
                disabled={saveState.status === "saving"}
                className="shrink-0"
              >
                {saveState.status === "saving" ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" aria-hidden="true" />
                    Save project
                  </>
                )}
              </Button>
            )}
          </div>
          {saveState.status === "saved" ? (
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-forest-900/10 pt-4">
              <p className="text-[10px] text-forest-800">
                The saved version is now in review. Further edits in this browser are not applied
                until you save again.
              </p>
              <Link
                href={`/dashboard/content/${saveState.result.projectId}`}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-forest-900 underline-offset-4 hover:underline"
              >
                Open in dashboard
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          ) : null}
          {saveState.status === "error" ? (
            <p role="alert" className="mt-3 text-[10.5px] leading-5 text-danger-ink">
              {saveState.message}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="rounded-[18px] border border-amber-ink/15 bg-amber-bg p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white-warm text-amber-ink">
                <Lock className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[12.5px] font-bold text-amber-ink">
                  Sign in to save this project for review
                </p>
                <p className="mt-1 max-w-lg text-[10.5px] leading-5 text-amber-ink/80">
                  Exports stay available without an account. Saving adds the project to the demo
                  workspace and audit trail. Demo credentials are on the sign-in page.
                </p>
              </div>
            </div>
            <Button asChild variant="secondary" className="shrink-0">
              <Link href="/login?next=/content-studio">
                Sign in
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[18px] border border-line bg-white-warm p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-700">
            Download the reviewed draft
          </p>
          <p className="mt-2 text-[10.5px] leading-5 text-ink-muted">
            Each file carries the review record and a clear AI-assistance disclaimer.
          </p>
          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={() => download("md")}
              className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ivory-50 px-3.5 py-3 text-left transition-colors hover:border-forest-900/25 hover:bg-mint-50"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-forest-700" aria-hidden="true" />
                <span>
                  <span className="block text-[11px] font-bold text-forest-900">Markdown review pack</span>
                  <span className="mt-0.5 block text-[9px] text-ink-muted">Copy, research checks and review record</span>
                </span>
              </span>
              <Download className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => download("csv")}
              className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ivory-50 px-3.5 py-3 text-left transition-colors hover:border-forest-900/25 hover:bg-mint-50"
            >
              <span className="flex items-center gap-2.5">
                <FileSpreadsheet className="h-4 w-4 text-forest-700" aria-hidden="true" />
                <span>
                  <span className="block text-[11px] font-bold text-forest-900">CSV slide sheet</span>
                  <span className="mt-0.5 block text-[9px] text-ink-muted">One row per slide for a designer or editor</span>
                </span>
              </span>
              <Download className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => download("json")}
              className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ivory-50 px-3.5 py-3 text-left transition-colors hover:border-forest-900/25 hover:bg-mint-50"
            >
              <span className="flex items-center gap-2.5">
                <FileJson className="h-4 w-4 text-forest-700" aria-hidden="true" />
                <span>
                  <span className="block text-[11px] font-bold text-forest-900">Structured JSON</span>
                  <span className="mt-0.5 block text-[9px] text-ink-muted">Portable project data with source checks</span>
                </span>
              </span>
              <Download className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            onClick={copyMarkdown}
            className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-forest-900 underline-offset-4 hover:underline"
          >
            {copied ? (
              <Check className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Copy className="h-3 w-3" aria-hidden="true" />
            )}
            {copied ? "Copied to clipboard" : "Copy markdown to clipboard"}
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[18px] border border-line bg-forest-950 p-5 text-ivory-50">
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-ivory-50/10"
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-mint-300">
                Canva handoff
              </p>
              <Badge variant="ghostInverse">Manual</Badge>
            </div>
            <p className="mt-3 font-display text-[25px] leading-tight">
              Carry the system, not just the text.
            </p>
            <ol className="mt-4 space-y-2.5 text-[10.5px] leading-5 text-ivory-50/60">
              <li className="flex gap-2.5">
                <span className="font-display text-coral-300">01</span>
                Create a 1080 × 1350 px Canva design.
              </li>
              <li className="flex gap-2.5">
                <span className="font-display text-coral-300">02</span>
                Set the palette from the {direction.name} direction.
              </li>
              <li className="flex gap-2.5">
                <span className="font-display text-coral-300">03</span>
                Paste slide copy from the CSV and add alternative text.
              </li>
              <li className="flex gap-2.5">
                <span className="font-display text-coral-300">04</span>
                Keep the reviewer name and disclaimer in the handoff note.
              </li>
            </ol>
            <div className="mt-4 flex gap-1.5" aria-hidden="true">
              {[
                direction.colors.background,
                direction.colors.ink,
                direction.colors.accent,
                direction.colors.muted,
              ].map((color) => (
                <span
                  key={color}
                  className="h-5 w-5 rounded-full border border-ivory-50/20"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <a
              href="https://www.canva.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-mint-300 underline-offset-4 hover:underline"
            >
              Open Canva
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            <p className="mt-3 text-[8.5px] leading-4 text-ivory-50/35">
              No Canva API or template is connected. This is an honest manual handoff.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 rounded-[16px] border border-line bg-ivory-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-[11px] font-bold text-forest-900">
            Reviewed by {reviewerName || "an unnamed reviewer"}
          </p>
          <p className="mt-1 text-[10px] leading-5 text-ink-muted">
            {reviewNotes || "No review note was recorded."} · {outline.length} outline items · {research?.engine === "n8n" ? "n8n research" : "Local demo research"}
          </p>
        </div>
        <Button type="button" variant="weakness" size="sm" onClick={startNewBrief}>
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          New brief
        </Button>
      </div>
    </div>
  );
}
