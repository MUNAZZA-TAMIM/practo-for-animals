"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  appendAuditLog,
  getProviderByUserId,
  getAppointmentRequestsByProvider,
  updateAppointmentRequestStatus,
  updateProviderRecord,
} from "@/lib/db";
import { requireProvider } from "@/lib/auth/session";
import type { AppointmentStatus } from "@/lib/db";

const providerListingUpdateSchema = z.object({
  name: z.string().trim().min(2, "Enter your business name").max(120),
  category: z.enum([
    "veterinary",
    "emergency",
    "grooming",
    "boarding",
    "training",
    "mobile",
    "exotic",
    "rescue",
    "equine",
  ], { message: "Choose a care category" }),
  about: z.string().trim().min(10, "Tell us about your animal-care services").max(1000),
  address: z.string().trim().min(2, "Enter your address").max(200),
  phone: z.string().trim().min(8, "Enter a contact number").max(24).regex(/^[+()\d\s-]+$/, "Use digits, spaces, +, ( ) or - only"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(160).optional().default(""),
  website: z.string().trim().max(500).refine(value => value === "" || /^https?:\/\/[^\s]+$/i.test(value), "Enter a full URL starting with http:// or https://").optional().default(""),
  hours: z.string().trim().min(2, "Enter your opening hours").max(200),
  services: z.array(z.string().min(1).max(100)).min(1, "Select at least one service").max(20),
  species: z.array(z.string().min(1).max(50)).min(1, "Select at least one animal type").max(20),
  priceNote: z.string().trim().max(500).optional().default(""),
});

export async function updateProviderListing(
  _prev: { status: "idle" | "error"; message?: string },
  formData: FormData,
): Promise<{ status: "idle" | "error"; message?: string }> {
  const session = await requireProvider();
  if (!session.providerId) {
    return { status: "error", message: "Provider account is not linked to a listing." };
  }

  const provider = await getProviderByUserId(session.providerId);
  if (!provider) {
    return { status: "error", message: "Provider listing not found." };
  }

  const parsed = providerListingUpdateSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    about: String(formData.get("about") ?? ""),
    address: String(formData.get("address") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    website: String(formData.get("website") ?? ""),
    hours: String(formData.get("hours") ?? ""),
    services: formData.getAll("services"),
    species: formData.getAll("species"),
    priceNote: String(formData.get("priceNote") ?? ""),
  });

  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields." };
  }

  try {
    const record = await updateProviderRecord(provider.id, parsed.data);
    if (!record) {
      return { status: "error", message: "Provider listing not found." };
    }

    await appendAuditLog({
      actor: session.email,
      action: "provider.listing_updated",
      entityType: "provider",
      entityId: provider.id,
      detail: `Provider ${provider.name} updated listing details.`,
    });

    revalidatePath("/provider-dashboard");
    revalidatePath("/provider-dashboard/listing");
    revalidatePath(`/providers/${provider.slug}`);
    return { status: "idle" };
  } catch {
    return { status: "error", message: "Unable to update listing. Try again." };
  }
}

export async function updateProviderServices(
  _prev: { status: "idle" | "error"; message?: string },
  formData: FormData,
): Promise<{ status: "idle" | "error"; message?: string }> {
  const session = await requireProvider();
  if (!session.providerId) {
    return { status: "error", message: "Provider account is not linked to a listing." };
  }

  const provider = await getProviderByUserId(session.providerId);
  if (!provider) {
    return { status: "error", message: "Provider listing not found." };
  }

  const services = formData.getAll("services").filter((s): s is string => typeof s === "string" && s.trim().length > 0);
  if (services.length === 0) {
    return { status: "error", message: "Select at least one service." };
  }

  try {
    const record = await updateProviderRecord(provider.id, { services });
    if (!record) {
      return { status: "error", message: "Provider listing not found." };
    }

    await appendAuditLog({
      actor: session.email,
      action: "provider.services_updated",
      entityType: "provider",
      entityId: provider.id,
      detail: `Provider ${provider.name} updated services: ${services.join(", ")}.`,
    });

    revalidatePath("/provider-dashboard");
    revalidatePath("/provider-dashboard/services");
    revalidatePath("/provider-dashboard/listing");
    revalidatePath(`/providers/${provider.slug}`);
    return { status: "idle" };
  } catch {
    return { status: "error", message: "Unable to update services. Try again." };
  }
}

export async function updateProviderAppointmentStatus(
  _prev: { status: "idle" | "error"; message?: string },
  formData: FormData,
): Promise<{ status: "idle" | "error"; message?: string }> {
  const session = await requireProvider();
  if (!session.providerId) {
    return { status: "error", message: "Provider account is not linked to a listing." };
  }

  const provider = await getProviderByUserId(session.providerId);
  if (!provider) {
    return { status: "error", message: "Provider listing not found." };
  }

  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const reviewNote = String(formData.get("reviewNote") ?? "");

  const validDecisions = ["approve", "reject", "request_changes", "complete"] as const;
  if (!(decision as (typeof validDecisions)[number])) {
    return { status: "error", message: "Invalid appointment action." };
  }

  const { readDatabase } = await import("@/lib/db/store");
  const database = await readDatabase();
  const record = database.appointmentRequests.find((entry) => entry.id === id);
  if (!record) {
    return { status: "error", message: "Appointment request not found." };
  }

  if (record.providerSlug !== provider.slug) {
    return { status: "error", message: "You can only manage appointments for your own listing." };
  }

  if (record.status !== "pending") {
    return { status: "error", message: "Only pending requests can be updated." };
  }

  let nextStatus: AppointmentStatus;
  if (decision === "approve") nextStatus = "approved";
  else if (decision === "reject") nextStatus = "rejected";
  else if (decision === "complete") nextStatus = "completed";
  else nextStatus = "pending";

  try {
    const updated = await updateAppointmentRequestStatus(id, nextStatus, session.name);
    if (!updated) {
      return { status: "error", message: "Appointment request not found." };
    }

    await appendAuditLog({
      actor: session.email,
      action: `provider.appointment.${decision}`,
      entityType: "appointment_request",
      entityId: record.id,
      detail: `Provider ${provider.name} ${decision} appointment ${record.reference}.`,
    });

    revalidatePath("/provider-dashboard");
    revalidatePath("/provider-dashboard/appointments");
    return { status: "idle" };
  } catch {
    return { status: "error", message: "Unable to update appointment. Try again." };
  }
}
