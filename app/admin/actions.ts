"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  appendAuditLog,
  resolveCorrectionRecord,
  updateAppointmentRequestStatus,
  updateProviderStatus,
  type AppointmentStatus,
} from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import {
  correctionDecisionSchema,
  providerStatusSchema,
} from "@/lib/validation/schemas";

const appointmentDecisionSchema = z.object({
  id: z.string().min(1),
  decision: z.enum(["approve", "reject", "request_changes"]),
  reviewNote: z.string().trim().max(1000).optional().default(""),
});

export async function providerDecisionAction(formData: FormData) {
  const session = await requireAdmin();
  const parsed = providerStatusSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    action: String(formData.get("action") ?? ""),
  });
  if (!parsed.success) return;

  const provider = await updateProviderStatus(
    parsed.data.id,
    parsed.data.action === "publish" ? "published" : "paused",
  );
  if (provider) {
    await appendAuditLog({
      actor: session.email,
      action: `provider.${parsed.data.action}`,
      entityType: "provider",
      entityId: provider.id,
      detail: `${provider.name} set to ${parsed.data.action} via admin review.`,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/providers");
  revalidatePath("/find");
  revalidatePath("/");
}

export async function correctionDecisionAction(formData: FormData) {
  const session = await requireAdmin();
  const parsed = correctionDecisionSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    decision: String(formData.get("decision") ?? ""),
    reviewNote: String(formData.get("reviewNote") ?? ""),
  });
  if (!parsed.success) return;

  const result = await resolveCorrectionRecord(
    parsed.data.id,
    parsed.data.decision,
    parsed.data.reviewNote,
    session.name,
  );

  if (result) {
    await appendAuditLog({
      actor: session.email,
      action: `admin.correction.${parsed.data.decision}`,
      entityType: "correction",
      entityId: result.correction.id,
      detail: result.providerUpdated
        ? `${result.correction.providerName} ${result.correction.field} updated after admin approval.`
        : `Correction ${result.correction.reference} marked ${parsed.data.decision}.`,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/corrections");
  revalidatePath("/find");
  revalidatePath(`/providers/${result?.correction.providerSlug ?? ""}`);
}

export async function appointmentDecisionAction(formData: FormData) {
  const session = await requireAdmin();
  const parsed = appointmentDecisionSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    decision: String(formData.get("decision") ?? ""),
    reviewNote: String(formData.get("reviewNote") ?? ""),
  });
  if (!parsed.success) return;

  let nextStatus: AppointmentStatus;
  if (parsed.data.decision === "approve") nextStatus = "approved";
  else if (parsed.data.decision === "reject") nextStatus = "rejected";
  else nextStatus = "pending";

  const record = await updateAppointmentRequestStatus(
    parsed.data.id,
    nextStatus,
    session.name,
  );

  if (record) {
    await appendAuditLog({
      actor: session.email,
      action: `admin.appointment.${parsed.data.decision}`,
      entityType: "appointment_request",
      entityId: record.id,
      detail: `${record.providerName} · ${record.service} marked ${parsed.data.decision} via admin review.`,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
}
