"use server";

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import type {
  AppointmentRequest,
  AppointmentStatus,
  AuditLog,
  BusinessEnquiry,
  BusinessEnquiryStatus,
  BusinessListing,
  ContentProject,
  ContentStatus,
  Correction,
  CorrectionDecision,
  CorrectionField,
  EducationLead,
  EducationLeadStatus,
  NewAppointmentRequest,
  NewAnimal,
  NewBusinessEnquiry,
  NewBusinessListing,
  NewContentProject,
  NewCorrection,
  NewEducationLead,
  Provider,
  ProviderStatus,
  WorkflowRun,
  WorkflowStatus,
} from "./types";
import type { Provider as ProviderType } from "@/lib/data/providers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseClient: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.",
    );
  }
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: "public" },
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabaseClient;
}

function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

function fromSnakeCase<T extends Record<string, unknown>>(
  obj: Record<string, unknown>,
): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (m) => m[1].toUpperCase());
    result[camelKey] = value;
  }
  return result as T;
}

// ---------------------------------------------------------------------------
// Provider helpers
// ============================================================================

async function getProviderByIdFromDb(id: string): Promise<Provider | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return fromSnakeCase<Provider>(data);
}

async function getProviderBySlugFromDb(slug: string): Promise<Provider | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return fromSnakeCase<Provider>(data);
}

async function getProviderByUserIdFromDb(userId: string): Promise<Provider | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("provider_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return fromSnakeCase<Provider>(data);
}

// ---------------------------------------------------------------------------
// AppointmentRequest
// ============================================================================

export async function getAppointmentRequests(
  userId?: string,
): Promise<AppointmentRequest[]> {
  const supabase = getClient();
  let query = supabase
    .from("appointment_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (userId) {
    query = query.eq("user_id", userId);
  }
  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((r) => fromSnakeCase<AppointmentRequest>(r));
}

export async function updateAppointmentRequestStatus(
  id: string,
  status: AppointmentStatus,
  actor: string,
): Promise<AppointmentRequest | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("appointment_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error || !data) return null;

  await appendAuditLog({
    actor,
    action: "appointment_request.status_changed",
    entityType: "appointment_request",
    entityId: id,
    detail: `${(data as any).provider_name} · ${(data as any).service} moved to ${status}.`,
  });

  return fromSnakeCase<AppointmentRequest>(data);
}

export async function cancelAppointmentRequest(
  id: string,
  actor: string,
): Promise<AppointmentRequest | null> {
  return updateAppointmentRequestStatus(id, "cancelled", actor);
}

export async function createAppointmentRequestRecord(
  input: NewAppointmentRequest,
): Promise<AppointmentRequest> {
  const supabase = getClient();
  const timestamp = new Date().toISOString();
  const record: Record<string, unknown> = {
    ...input,
    reference: makeReference("AP"),
    status: "pending",
    is_sample: false,
    created_at: timestamp,
    updated_at: timestamp,
  };
  const { data, error } = await supabase
    .from("appointment_requests")
    .insert(toSnakeCase(record))
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message || "Failed to create appointment request");
  return fromSnakeCase<AppointmentRequest>(data);
}

export async function getAppointmentRequestsByProvider(
  providerSlug: string,
): Promise<AppointmentRequest[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("appointment_requests")
    .select("*")
    .eq("provider_slug", providerSlug)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => fromSnakeCase<AppointmentRequest>(r));
}

// ---------------------------------------------------------------------------
// Provider
// ============================================================================

export async function getProviders(): Promise<Provider[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .order("name", { ascending: true });
  if (error || !data) return [];
  return data.map((r) => fromSnakeCase<Provider>(r));
}

export async function getPublishedProviders(): Promise<Provider[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("status", "published")
    .order("name", { ascending: true });
  if (error || !data) return [];
  return data.map((r) => fromSnakeCase<Provider>(r));
}

export async function getProviderBySlug(slug: string): Promise<Provider | null> {
  return getProviderBySlugFromDb(slug);
}

export async function getProviderById(id: string): Promise<Provider | null> {
  return getProviderByIdFromDb(id);
}

export async function getProviderByUserId(userId: string): Promise<Provider | null> {
  return getProviderByUserIdFromDb(userId);
}

export async function updateProviderStatus(
  id: string,
  status: ProviderStatus,
): Promise<Provider | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("providers")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error || !data) return null;
  return fromSnakeCase<Provider>(data);
}

export async function toggleProviderFeature(
  id: string,
  featured: boolean,
): Promise<Provider | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("providers")
    .update({ featured, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error || !data) return null;
  return fromSnakeCase<Provider>(data);
}

export async function updateProviderRecord(
  id: string,
  input: Partial<
    Provider & { isSample?: boolean; providerId?: string; updatedAt?: string }
  >,
): Promise<Provider | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("providers")
    .update({ ...toSnakeCase(input), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error || !data) return null;
  return fromSnakeCase<Provider>(data);
}

// ---------------------------------------------------------------------------
// Animal
// ============================================================================

export async function getAnimals(userId: string): Promise<Animal[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("animals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => fromSnakeCase<Animal>(r));
}

export async function createAnimal(input: NewAnimal): Promise<Animal> {
  const supabase = getClient();
  const timestamp = new Date().toISOString();
  const record: Record<string, unknown> = {
    ...input,
    id: randomUUID(),
    is_sample: false,
    created_at: timestamp,
    updated_at: timestamp,
  };
  const { data, error } = await supabase
    .from("animals")
    .insert(toSnakeCase(record))
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message || "Failed to create animal");
  return fromSnakeCase<Animal>(data);
}

export async function updateAnimal(
  id: string,
  input: Partial<NewAnimal>,
  userId: string,
): Promise<Animal | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("animals")
    .update({ ...toSnakeCase(input), updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();
  if (error || !data) return null;
  return fromSnakeCase<Animal>(data);
}

export async function deleteAnimal(id: string, userId: string): Promise<boolean> {
  const supabase = getClient();
  const { error } = await supabase
    .from("animals")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  return !error;
}

// ---------------------------------------------------------------------------
// BusinessEnquiry
// ============================================================================

export async function getBusinessEnquiries(): Promise<BusinessEnquiry[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("business_enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => fromSnakeCase<BusinessEnquiry>(r));
}

export async function createBusinessEnquiryRecord(
  input: NewBusinessEnquiry,
): Promise<BusinessEnquiry> {
  const supabase = getClient();
  const timestamp = new Date().toISOString();
  const record: Record<string, unknown> = {
    ...input,
    id: randomUUID(),
    reference: makeReference("B"),
    status: "new",
    is_sample: false,
    created_at: timestamp,
    updated_at: timestamp,
  };
  const { data, error } = await supabase
    .from("business_enquiries")
    .insert(toSnakeCase(record))
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message || "Failed to create business enquiry");
  return fromSnakeCase<BusinessEnquiry>(data);
}

export async function updateBusinessEnquiryStatus(
  id: string,
  status: BusinessEnquiryStatus,
): Promise<BusinessEnquiry | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("business_enquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error || !data) return null;
  return fromSnakeCase<BusinessEnquiry>(data);
}

// ---------------------------------------------------------------------------
// Correction
// ============================================================================

export async function getCorrections(): Promise<Correction[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("corrections")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => fromSnakeCase<Correction>(r));
}

function currentValueFor(provider: ProviderType, field: CorrectionField): string {
  switch (field) {
    case "phone":
      return provider.phone;
    case "address":
      return provider.address;
    case "website":
      return provider.website ?? "Not listed";
    case "hours":
      return provider.hours;
    case "services":
      return provider.services.join(", ");
    default:
      return "Not specified";
  }
}

export async function createCorrectionRecord(input: NewCorrection): Promise<Correction> {
  const supabase = getClient();
  const provider = await getProviderBySlugFromDb(input.providerSlug);
  if (!provider) throw new Error("Provider not found");
  const timestamp = new Date().toISOString();
  const record: Record<string, unknown> = {
    ...input,
    id: randomUUID(),
    reference: makeReference("C"),
    provider_name: provider.name,
    current_value: currentValueFor(provider, input.field),
    status: "pending",
    is_sample: false,
    created_at: timestamp,
    updated_at: timestamp,
  };
  const { data, error } = await supabase
    .from("corrections")
    .insert(toSnakeCase(record))
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message || "Failed to create correction");
  return fromSnakeCase<Correction>(data);
}

export async function resolveCorrectionRecord(
  id: string,
  decision: CorrectionDecision,
  reviewNote: string,
  actor: string,
): Promise<{ correction: Correction; providerUpdated: boolean } | null> {
  const supabase = getClient();
  const { data: correctionData, error: correctionError } = await supabase
    .from("corrections")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (correctionError || !correctionData) return null;
  if (correctionData.status !== "pending") {
    return { correction: fromSnakeCase<Correction>(correctionData), providerUpdated: false };
  }

  const timestamp = new Date().toISOString();
  const updateData: Record<string, unknown> = {
    status: decision,
    review_note: reviewNote || undefined,
    reviewed_by: actor,
    reviewed_at: timestamp,
    updated_at: timestamp,
  };

  let providerUpdated = false;
  if (decision === "approved") {
    const provider = await getProviderBySlugFromDb(correctionData.provider_slug);
    if (provider) {
      let updatedProvider: Record<string, unknown> = { ...provider, updated_at: timestamp };
      switch (correctionData.field) {
        case "phone":
          updatedProvider.phone = correctionData.proposed_value;
          break;
        case "address":
          updatedProvider.address = correctionData.proposed_value;
          break;
        case "website":
          updatedProvider.website = correctionData.proposed_value;
          break;
        case "hours":
          updatedProvider.hours = correctionData.proposed_value;
          break;
        case "services":
          updatedProvider.services = correctionData.proposed_value
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
          break;
      }
      const { error: providerError } = await supabase
        .from("providers")
        .update(toSnakeCase(updatedProvider))
        .eq("id", provider.id);
      if (!providerError) {
        providerUpdated = true;
      }
    }
  }

  const { data: updatedCorrection, error: updateError } = await supabase
      .from("corrections")
      .update(toSnakeCase(updateData))
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (updateError || !updatedCorrection) return null;

    await appendAuditLog({
      actor,
      action: `correction.${decision}`,
      entityType: "correction",
      entityId: id,
      detail: providerUpdated
        ? `${updatedCorrection.provider_name} ${updatedCorrection.field} updated after approval.`
        : `Correction ${updatedCorrection.reference} marked ${decision}.`,
    });

    return {
      correction: fromSnakeCase<Correction>(updatedCorrection),
      providerUpdated,
    };
}
