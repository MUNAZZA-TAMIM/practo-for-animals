"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { saveContentProjectSchema } from "@/lib/validation/schemas";
import {
  appendAuditLog,
  appendWorkflowRun,
  createContentProjectRecord,
  currentTimestamp,
} from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { getClientIdentifier } from "@/lib/request";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";

export type SaveStudioResult =
  | { ok: true; reference: string; projectId: string }
  | { ok: false; error: string };

export async function saveStudioProject(input: unknown): Promise<SaveStudioResult> {
  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      error: "Sign in with a demo account to save this project to the review queue.",
    };
  }

  const identifier = await getClientIdentifier();
  const limit = rateLimit(rateLimitKey("studio-save", identifier), 8, 10 * 60_000);
  if (!limit.ok) {
    return {
      ok: false,
      error: `Too many saves. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
    };
  }

  const parsed = saveContentProjectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Some project details are incomplete. Review the checklist and try again.",
    };
  }

  const reviewed = Object.values(parsed.data.review).every(Boolean);
  if (!reviewed) {
    return {
      ok: false,
      error: "Every review item must be confirmed before the project can be saved for review.",
    };
  }

  try {
    const project = await createContentProjectRecord({
      title: parsed.data.title,
      brief: parsed.data.brief,
      research: parsed.data.research,
      outline: parsed.data.outline,
      slides: parsed.data.slides,
      designDirection: parsed.data.designDirection,
      review: parsed.data.review,
      reviewerName: parsed.data.reviewerName,
      reviewNotes: parsed.data.reviewNotes ?? "",
    });

    const now = currentTimestamp();
    await appendWorkflowRun({
      id: randomUUID(),
      workflow: "content-generation",
      subjectType: "content_project",
      subjectId: project.id,
      subjectLabel: project.title,
      status: "completed",
      mode: "demo-adapter",
      steps: [
        {
          name: "Brief and outline accepted",
          status: "completed",
          at: now,
          detail: "Validated with the shared studio schema.",
        },
        {
          name: "Human review recorded",
          status: "completed",
          at: now,
          detail: `All six checklist items confirmed by ${project.reviewerName}.`,
        },
        {
          name: "Project queued for founder review",
          status: "completed",
          at: now,
          detail: "Visible on the dashboard content desk.",
        },
        {
          name: "Notification",
          status: "simulated",
          at: now,
          detail: "No n8n webhook or email integration is configured.",
        },
      ],
      startedAt: now,
      finishedAt: now,
      isSample: false,
    });

    await appendAuditLog({
      actor: session.email,
      action: "content_project.created",
      entityType: "content_project",
      entityId: project.id,
      detail: `Studio project ${project.reference} saved with human review.`,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/content");

    return { ok: true, reference: project.reference, projectId: project.id };
  } catch (error) {
    console.error(
      "[studio-save] Failed to save project",
      error instanceof Error ? error.message : "unknown error",
    );
    return {
      ok: false,
      error: "The project could not be saved. Please try again in a moment.",
    };
  }
}
