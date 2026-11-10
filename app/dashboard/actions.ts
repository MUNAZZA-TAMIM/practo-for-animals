"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  appendAuditLog,
  resetDemoDatabase,
  resolveCorrectionRecord,
  toggleProviderFeature,
  updateBusinessEnquiryStatus,
  updateContentProjectStatus,
  updateEducationLeadStatus,
  updateProviderStatus,
} from "@/lib/db";
import { requireAdmin, requireUser } from "@/lib/auth/session";
import { contentDecisionSchema, correctionDecisionSchema } from "@/lib/validation/schemas";

const businessStatusSchema = z.enum(["new", "in_review", "contacted", "closed"]);
const educationStatusSchema = z.enum(["new", "contacted", "enrolled", "closed"]);

export async function providerModerationAction(formData: FormData) {
  const session = await requireUser("/dashboard/providers");
  const id = String(formData.get("id") ?? "");
  const action = String(formData.get("action") ?? "");

  if (!id) return;

  if (action === "publish" || action === "pause") {
    const provider = await updateProviderStatus(
      id,
      action === "publish" ? "published" : "paused",
    );
    if (provider) {
      await appendAuditLog({
        actor: session.email,
        action: `provider.${action}`,
        entityType: "provider",
        entityId: provider.id,
        detail: `${provider.name} set to ${action === "publish" ? "published" : "paused"}.`,
      });
    }
  } else if (action === "feature" || action === "unfeature") {
    const provider = await toggleProviderFeature(id, action === "feature");
    if (provider) {
      await appendAuditLog({
        actor: session.email,
        action: `provider.${action}`,
        entityType: "provider",
        entityId: provider.id,
        detail: `${provider.name} ${action === "feature" ? "added to" : "removed from"} featured listings.`,
      });
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/providers");
  revalidatePath("/find");
  revalidatePath("/");
}

export async function businessEnquiryStatusAction(formData: FormData) {
  const session = await requireUser("/dashboard/enquiries");
  const id = String(formData.get("id") ?? "");
  const parsed = businessStatusSchema.safeParse(formData.get("status"));
  if (!id || !parsed.success) return;

  const record = await updateBusinessEnquiryStatus(id, parsed.data);
  if (record) {
    await appendAuditLog({
      actor: session.email,
      action: "business_enquiry.status_changed",
      entityType: "business_enquiry",
      entityId: record.id,
      detail: `${record.businessName} moved to ${parsed.data}.`,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/enquiries");
}

export async function educationLeadStatusAction(formData: FormData) {
  const session = await requireUser("/dashboard/enquiries");
  const id = String(formData.get("id") ?? "");
  const parsed = educationStatusSchema.safeParse(formData.get("status"));
  if (!id || !parsed.success) return;

  const record = await updateEducationLeadStatus(id, parsed.data);
  if (record) {
    await appendAuditLog({
      actor: session.email,
      action: "education_lead.status_changed",
      entityType: "education_lead",
      entityId: record.id,
      detail: `${record.fullName} moved to ${parsed.data}.`,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/enquiries");
}

export async function correctionDecisionAction(formData: FormData) {
  const session = await requireUser("/dashboard/corrections");
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
      action: `correction.${parsed.data.decision}`,
      entityType: "correction",
      entityId: result.correction.id,
      detail: result.providerUpdated
        ? `${result.correction.providerName} ${result.correction.field} updated after approval.`
        : `Correction ${result.correction.reference} marked ${parsed.data.decision}.`,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/corrections");
  revalidatePath("/find");
  revalidatePath(`/providers/${result?.correction.providerSlug ?? ""}`);
}

export async function contentDecisionAction(formData: FormData) {
  const session = await requireUser("/dashboard/content");
  const parsed = contentDecisionSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    decision: String(formData.get("decision") ?? ""),
    note: String(formData.get("note") ?? ""),
  });
  if (!parsed.success) return;

  if (parsed.data.decision === "request_changes" && parsed.data.note.trim().length < 5) {
    return;
  }

  const nextStatus =
    parsed.data.decision === "approve"
      ? "approved"
      : parsed.data.decision === "request_changes"
        ? "changes_requested"
        : "exported";

  const project = await updateContentProjectStatus(
    parsed.data.id,
    nextStatus,
    session.name,
    parsed.data.note,
  );

  if (project) {
    await appendAuditLog({
      actor: session.email,
      action: `content_project.${parsed.data.decision}`,
      entityType: "content_project",
      entityId: project.id,
      detail: `${project.reference} moved to ${nextStatus}.`,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/content");
  revalidatePath(`/dashboard/content/${parsed.data.id}`);
}

export async function resetDemoDataAction() {
  const session = await requireAdmin();
  await resetDemoDatabase(session.email);
  revalidatePath("/", "layout");
  redirect("/admin?notice=reset");
}
