import type { ContentProject } from "@/lib/db/types";
import {
  DESIGN_DIRECTIONS,
  REVIEW_ITEMS,
  STUDIO_AUDIENCES,
  STUDIO_CHANNELS,
  STUDIO_TONES,
  type StudioAudience,
  type StudioChannel,
  type StudioTone,
} from "@/lib/studio/data";

export function audienceName(value: StudioAudience) {
  return STUDIO_AUDIENCES.find((audience) => audience.value === value)?.label ?? value;
}

export function channelName(value: StudioChannel) {
  return STUDIO_CHANNELS.find((channel) => channel.value === value)?.label ?? value;
}

export function toneName(value: StudioTone) {
  return STUDIO_TONES.find((tone) => tone.value === value)?.label ?? value;
}

export function designName(value: string) {
  return DESIGN_DIRECTIONS.find((direction) => direction.id === value)?.name ?? value;
}

const disclaimer =
  "Draft created with AI assistance. General education only — not veterinary advice. Reviewed by a named human before publication.";

export function buildMarkdown(project: ContentProject) {
  const lines: string[] = [
    `# ${project.title}`,
    "",
    `**Reference:** ${project.reference}`,
    `**Audience:** ${audienceName(project.brief.audience)}`,
    `**Channel:** ${channelName(project.brief.channel)}`,
    `**Tone:** ${toneName(project.brief.tone)}`,
    `**Design direction:** ${designName(project.designDirection)}`,
    `**Reviewer:** ${project.reviewerName || "Not recorded"}`,
    `**Status:** ${project.status.replace(/_/g, " ")}`,
    "",
    `> ${disclaimer}`,
    "",
    "## Creative brief",
    "",
    `**Idea:** ${project.brief.topic}`,
    "",
    `**Goal:** ${project.brief.goal || "Not specified"}`,
    "",
  ];

  project.slides.forEach((slide, index) => {
    lines.push(`## Slide ${index + 1}${index === 0 ? " · Cover" : ""}`);
    lines.push("");
    if (slide.kicker) lines.push(`*${slide.kicker}*`, "");
    lines.push(`### ${slide.title}`, "");
    lines.push(slide.body, "");
    if (slide.cta) lines.push(`**CTA:** ${slide.cta}`, "");
    if (slide.imageNote) lines.push(`**Art note:** ${slide.imageNote}`, "");
  });

  lines.push("## Research checks", "");
  project.research.checks.forEach((check) => lines.push(`- ${check}`));
  lines.push("", "## Human review", "");
  REVIEW_ITEMS.forEach((item) => {
    lines.push(
      `- ${project.review[item.id] ? "✓" : "○"} ${item.label}`,
    );
  });
  if (project.reviewNotes) {
    lines.push("", `**Reviewer note:** ${project.reviewNotes}`);
  }
  lines.push(
    "",
    "---",
    "",
    "No statistics, testimonials, provider verification, or partnerships are claimed in this draft.",
    "",
  );

  return lines.join("\n");
}

function csvEscape(value: string | undefined) {
  const text = value ?? "";
  return `"${text.replace(/"/g, '""')}"`;
}

export function buildCsv(project: ContentProject) {
  const rows = [
    ["slide", "type", "kicker", "headline", "body", "cta", "art_note"],
    ...project.slides.map((slide, index) => [
      String(index + 1),
      index === 0 ? "cover" : index === project.slides.length - 1 ? "cta" : "content",
      slide.kicker ?? "",
      slide.title,
      slide.body,
      slide.cta ?? "",
      slide.imageNote ?? "",
    ]),
  ];

  return rows.map((row) => row.map((cell) => csvEscape(cell)).join(",")).join("\n");
}

export function buildProjectJson(project: ContentProject) {
  return JSON.stringify(
    {
      schemaVersion: 1,
      reference: project.reference,
      title: project.title,
      exportedAt: new Date().toISOString(),
      disclaimer,
      brief: project.brief,
      research: project.research,
      outline: project.outline,
      slides: project.slides,
      designDirection: project.designDirection,
      review: {
        checklist: project.review,
        reviewerName: project.reviewerName,
        reviewNotes: project.reviewNotes,
      },
      status: project.status,
    },
    null,
    2,
  );
}

export function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function safeFilename(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "carousel"
  );
}
