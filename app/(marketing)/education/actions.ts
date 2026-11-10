"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { educationLeadSchema } from "@/lib/validation/schemas";
import {
  appendAuditLog,
  appendWorkflowRun,
  createEducationLeadRecord,
  currentTimestamp,
} from "@/lib/db";
import { getProgramme } from "@/lib/data/programs";
import { getClientIdentifier, isHoneypotFilled } from "@/lib/request";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";

export type EducationFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitEducationEnquiry(
  _previous: EducationFormState,
  formData: FormData,
): Promise<EducationFormState> {
  if (isHoneypotFilled(formData.get("companyWebsite"))) {
    return {
      status: "error",
      message: "We couldn’t process this submission. Please try again.",
    };
  }

  const identifier = await getClientIdentifier();
  const limit = rateLimit(rateLimitKey("education-lead", identifier), 5, 60 * 60_000);
  if (!limit.ok) {
    return {
      status: "error",
      message: `Too many enquiries from this connection. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
    };
  }

  const parsed = educationLeadSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const programme = getProgramme(parsed.data.programmeSlug);
  if (!programme) {
    return {
      status: "error",
      message: "Choose a programme from the list.",
      fieldErrors: { programmeSlug: ["Choose a valid programme"] },
    };
  }

  try {
    const record = await createEducationLeadRecord({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
      city: parsed.data.city || undefined,
      role: parsed.data.role,
      organisation: parsed.data.organisation || undefined,
      programmeSlug: programme.slug,
      programmeName: programme.name,
      goals: parsed.data.goals ?? "",
      consent: parsed.data.consent,
    });

    const now = currentTimestamp();
    await appendWorkflowRun({
      id: randomUUID(),
      workflow: "education-enquiry",
      subjectType: "education_lead",
      subjectId: record.id,
      subjectLabel: `${record.fullName} · ${record.programmeName}`,
      status: "completed",
      mode: "demo-adapter",
      steps: [
        {
          name: "Enquiry validated and stored",
          status: "completed",
          at: now,
        },
        {
          name: "Confirmation page prepared",
          status: "completed",
          at: now,
          detail: "No email was sent. The reference is shown on screen.",
        },
        {
          name: "Follow-up task",
          status: "simulated",
          at: now,
          detail: "n8n and email are not configured in this environment.",
        },
      ],
      startedAt: now,
      finishedAt: now,
      isSample: false,
    });

    await appendAuditLog({
      actor: "public:education-enquiry",
      action: "education_lead.created",
      entityType: "education_lead",
      entityId: record.id,
      detail: `Education enquiry ${record.reference} stored for review.`,
    });

    redirect(`/education/thank-you?ref=${encodeURIComponent(record.reference)}`);
  } catch (error) {
    if (
      error instanceof Error &&
      "digest" in error &&
      typeof (error as { digest?: unknown }).digest === "string"
    ) {
      throw error;
    }
    console.error(
      "[education-enquiry] Failed to store submission",
      error instanceof Error ? error.message : "unknown error",
    );
    return {
      status: "error",
      message:
        "Something went wrong while saving your enquiry. Please try again in a moment.",
    };
  }
}
