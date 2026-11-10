"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { correctionSchema } from "@/lib/validation/schemas";
import {
  appendAuditLog,
  appendWorkflowRun,
  createCorrectionRecord,
  currentTimestamp,
} from "@/lib/db";
import { getClientIdentifier, isHoneypotFilled } from "@/lib/request";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";

export type CorrectionFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  reference?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitCorrection(
  _previous: CorrectionFormState,
  formData: FormData,
): Promise<CorrectionFormState> {
  if (isHoneypotFilled(formData.get("companyWebsite"))) {
    return {
      status: "error",
      message: "We couldn’t process this submission. Please try again.",
    };
  }

  const identifier = await getClientIdentifier();
  const limit = rateLimit(rateLimitKey("correction", identifier), 6, 30 * 60_000);
  if (!limit.ok) {
    return {
      status: "error",
      message: `Too many submissions from this connection. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
    };
  }

  const parsed = correctionSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const record = await createCorrectionRecord({
      providerSlug: parsed.data.providerSlug,
      field: parsed.data.field,
      proposedValue: parsed.data.proposedValue,
      evidenceUrl: parsed.data.evidenceUrl || undefined,
      note: parsed.data.note ?? "",
      submitterName: parsed.data.submitterName,
      submitterEmail: parsed.data.submitterEmail,
    });

    const now = currentTimestamp();
    await appendWorkflowRun({
      id: randomUUID(),
      workflow: "correction-review",
      subjectType: "correction",
      subjectId: record.id,
      subjectLabel: `${record.providerName} · ${record.field}`,
      status: "needs_attention",
      mode: "demo-adapter",
      steps: [
        {
          name: "Correction validated and stored",
          status: "completed",
          at: now,
        },
        {
          name: "Held for human review",
          status: "running",
          at: now,
          detail: "A founder or administrator must approve or reject the change.",
        },
        {
          name: "Provider record update",
          status: "pending",
          at: now,
          detail: "Updates only after approval.",
        },
      ],
      startedAt: now,
      isSample: false,
    });

    await appendAuditLog({
      actor: "public:correction",
      action: "correction.created",
      entityType: "correction",
      entityId: record.id,
      detail: `Correction ${record.reference} queued for review.`,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/corrections");

    return {
      status: "success",
      reference: record.reference,
      message: "Your correction has been queued for human review.",
    };
  } catch (error) {
    console.error(
      "[correction] Failed to store submission",
      error instanceof Error ? error.message : "unknown error",
    );
    return {
      status: "error",
      message:
        "Something went wrong while saving the correction. Please try again in a moment.",
    };
  }
}
