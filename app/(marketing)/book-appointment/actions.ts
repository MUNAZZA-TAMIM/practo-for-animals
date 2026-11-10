"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { appointmentRequestSchema } from "@/lib/validation/schemas";
import {
  appendAuditLog,
  appendWorkflowRun,
  createAppointmentRequestRecord,
  currentTimestamp,
  getProviderBySlug,
} from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { getClientIdentifier, isHoneypotFilled } from "@/lib/request";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";

export type AppointmentRequestState = {
  status: "idle" | "error" | "success";
  message?: string;
  reference?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitAppointmentRequest(
  _previous: AppointmentRequestState,
  formData: FormData,
): Promise<AppointmentRequestState> {
  if (isHoneypotFilled(formData.get("companyWebsite"))) {
    return {
      status: "error",
      message: "We couldn’t process this submission. Please try again.",
    };
  }

  const identifier = await getClientIdentifier();
  const limit = rateLimit(
    rateLimitKey("appointment-request", identifier),
    6,
    30 * 60_000,
  );
  if (!limit.ok) {
    return {
      status: "error",
      message: `Too many submissions from this connection. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
    };
  }

  const parsed = appointmentRequestSchema.safeParse(
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
    const provider = await getProviderBySlug(parsed.data.providerSlug);
    if (!provider) {
      return {
        status: "error",
        message: "Provider not found.",
      };
    }

    const record = await createAppointmentRequestRecord({
      providerSlug: parsed.data.providerSlug,
      providerName: provider.name,
      category: provider.category,
      city: provider.city,
      area: provider.area,
      service: parsed.data.service,
      serviceDescription: parsed.data.serviceDescription || "",
      animalName: parsed.data.animalName,
      animalSpecies: parsed.data.animalSpecies,
      animalAge: parsed.data.animalAge || "",
      reasonForVisit: parsed.data.reasonForVisit || "",
      preferredDate: parsed.data.preferredDate,
      preferredTime: parsed.data.preferredTime,
      contactName: parsed.data.contactName,
      contactEmail: parsed.data.contactEmail,
      contactPhone: parsed.data.contactPhone,
      consent: parsed.data.consent,
      userId: (await getSession())?.sub ?? undefined,
    });

    const now = currentTimestamp();
    await appendWorkflowRun({
      id: randomUUID(),
      workflow: "appointment-request",
      subjectType: "content_project",
      subjectId: record.id,
      subjectLabel: `${record.providerName} · ${record.service}`,
      status: "needs_attention",
      mode: "demo-adapter",
      steps: [
        {
          name: "Appointment request validated and stored",
          status: "completed",
          at: now,
          detail: "Zod validation and local JSON persistence completed.",
        },
        {
          name: "Held for human review",
          status: "running",
          at: now,
          detail: "A provider or administrator must approve or reject the request.",
        },
        {
          name: "Provider notification",
          status: "pending",
          at: now,
          detail: "Awaiting provider confirmation of the appointment.",
        },
      ],
      startedAt: now,
      finishedAt: now,
      isSample: false,
    });

    await appendAuditLog({
      actor: "public:appointment-request",
      action: "appointment_request.created",
      entityType: "appointment_request",
      entityId: record.id,
      detail: `Appointment request ${record.reference} queued for review.`,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/enquiries");

    return {
      status: "success",
      reference: record.reference,
      message: "Your appointment request has been submitted for review.",
    };
  } catch (error) {
    console.error(
      "[appointment-request] Failed to store submission",
      error instanceof Error ? error.message : "unknown error",
    );
    return {
      status: "error",
      message:
        "Something went wrong while saving your request. Please try again in a moment.",
    };
  }
}
