import "server-only";

import { randomUUID } from "node:crypto";
import {
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
  WorkflowRun,
  Animal,
  NewAuditLog,
} from "./types";
import type { Provider, ProviderStatus } from "@/lib/data/providers";
import { mutateDatabase, readDatabase, resetDatabase, getDataStoreLocation } from "./store";
import { createSeedDatabase } from "./seed";

function makeReference(prefix: string) {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
}

function nowIso() {
  return new Date().toISOString();
}

// Data store mode: "local-demo" (default) or "postgres"
const DATA_MODE = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? "postgres"
  : "local-demo";

let localStore: typeof import("./store") | null = null;
let postgresClient: ReturnType<typeof import("./postgres")> | null = null;

function getLocalStore() {
  if (!localStore) {
    localStore = require("./store");
  }
  return localStore;
}

function getPostgresClient() {
  if (!postgresClient) {
    postgresClient = require("./postgres");
  }
  return postgresClient;
}

// Re-export all types from ./types
export type * from "./types";
export type { Provider, ProviderStatus } from "@/lib/data/providers";

// Re-export shared utilities from local store
export { readDatabase, resetDatabase, getDataStoreLocation };

// Data mode
export function getDataStoreMode(): "local-demo" | "postgres" {
  return DATA_MODE;
}

export function isPostgresMode(): boolean {
  return DATA_MODE === "postgres";
}

// ============================================================================
// BusinessListing
// ============================================================================

export async function createBusinessListingRecord(
  input: NewBusinessListing,
): Promise<BusinessListing> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().createBusinessListingRecord(input);
  }
  return mutateDatabase((database) => {
    const timestamp = nowIso();
    const record: BusinessListing = {
      ...input,
      id: randomUUID(),
      reference: makeReference("BL"),
      status: "pending",
      isSample: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    database.businessListings.unshift(record);
    return record;
  });
}

// ============================================================================
// AppointmentRequest
// ============================================================================

export async function createAppointmentRequestRecord(
  input: NewAppointmentRequest,
): Promise<AppointmentRequest> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().createAppointmentRequestRecord(input);
  }
  return mutateDatabase((database) => {
    const timestamp = nowIso();
    const record: AppointmentRequest = {
      ...input,
      id: randomUUID(),
      reference: makeReference("AP"),
      status: "pending",
      isSample: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    database.appointmentRequests.unshift(record);
    return record;
  });
}

export async function getAppointmentRequests(
  userId?: string,
): Promise<AppointmentRequest[]> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getAppointmentRequests(userId);
  }
  return mutateDatabase((database) => {
    const requests = [...database.appointmentRequests].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    if (userId) {
      return requests.filter((item) => item.userId === userId);
    }
    return requests;
  });
}

export async function updateAppointmentRequestStatus(
  id: string,
  status: AppointmentStatus,
  actor: string,
): Promise<AppointmentRequest | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().updateAppointmentRequestStatus(id, status, actor);
  }
  return mutateDatabase((database) => {
    const record = database.appointmentRequests.find((entry) => entry.id === id);
    if (!record) return null;
    record.status = status;
    record.updatedAt = nowIso();
    void appendAuditLog({
      actor,
      action: `appointment_request.status_changed`,
      entityType: "appointment_request",
      entityId: record.id,
      detail: `${record.providerName} · ${record.service} moved to ${status}.`,
    });
    return record;
  });
}

export async function cancelAppointmentRequest(
  id: string,
  actor: string,
): Promise<AppointmentRequest | null> {
  return updateAppointmentRequestStatus(id, "cancelled", actor);
}

// ============================================================================
// Animal
// ============================================================================

export async function getAnimals(userId: string): Promise<Animal[]> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getAnimals(userId);
  }
  return mutateDatabase((database) => {
    return [...database.animals]
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });
}

export async function createAnimal(input: NewAnimal): Promise<Animal> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().createAnimal(input);
  }
  return mutateDatabase((database) => {
    const timestamp = nowIso();
    const record: Animal = {
      ...input,
      id: randomUUID(),
      isSample: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    database.animals.unshift(record);
    return record;
  });
}

export async function updateAnimal(
  id: string,
  input: Partial<NewAnimal>,
  userId: string,
): Promise<Animal | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().updateAnimal(id, input, userId);
  }
  return mutateDatabase((database) => {
    const record = database.animals.find(
      (entry) => entry.id === id && entry.userId === userId,
    );
    if (!record) return null;
    Object.assign(record, input);
    record.updatedAt = nowIso();
    return record;
  });
}

export async function deleteAnimal(id: string, userId: string): Promise<boolean> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().deleteAnimal(id, userId);
  }
  return mutateDatabase((database) => {
    const index = database.animals.findIndex(
      (entry) => entry.id === id && entry.userId === userId,
    );
    if (index === -1) return false;
    database.animals.splice(index, 1);
    return true;
  });
}

// ============================================================================
// Providers
// ============================================================================

export async function getProviders(): Promise<Provider[]> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getProviders();
  }
  return mutateDatabase((database) => {
    return [...database.providers].sort((a, b) => a.name.localeCompare(b.name));
  });
}

export async function getPublishedProviders(): Promise<Provider[]> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getPublishedProviders();
  }
  return mutateDatabase((database) => {
    return [...database.providers].filter((provider) => provider.status === "published");
  });
}

export async function getProviderBySlug(slug: string): Promise<Provider | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getProviderBySlug(slug);
  }
  return mutateDatabase((database) => {
    return database.providers.find((provider) => provider.slug === slug) ?? null;
  });
}

export async function getProviderById(id: string): Promise<Provider | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getProviderById(id);
  }
  return mutateDatabase((database) => {
    return database.providers.find((entry) => entry.id === id) ?? null;
  });
}

export async function getProviderByUserId(userId: string): Promise<Provider | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getProviderByUserId(userId);
  }
  return mutateDatabase((database) => {
    // Support two lookup strategies:
    // 1. The session stores the provider record id (session.providerId = "prov-cedar-clover")
    //    → find the provider by provider.id
    // 2. The session stores the user id (session.sub = "user-provider-cedar")
    //    → find the provider by provider.providerId (the linked user id)
    return (
      database.providers.find((provider) => provider.id === userId) ??
      database.providers.find((provider) => provider.providerId === userId) ??
      null
    );
  });
}

export async function updateProviderStatus(
  id: string,
  status: ProviderStatus,
): Promise<Provider | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().updateProviderStatus(id, status);
  }
  return mutateDatabase((database) => {
    const provider = database.providers.find((entry) => entry.id === id);
    if (!provider) return null;
    provider.status = status;
    provider.updatedAt = nowIso();
    return provider;
  });
}

export async function toggleProviderFeature(
  id: string,
  featured: boolean,
): Promise<Provider | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().toggleProviderFeature(id, featured);
  }
  return mutateDatabase((database) => {
    const provider = database.providers.find((entry) => entry.id === id);
    if (!provider) return null;
    provider.featured = featured;
    provider.updatedAt = nowIso();
    return provider;
  });
}

export async function updateProviderRecord(
  id: string,
  input: Partial<
    Provider & { isSample?: boolean; providerId?: string; updatedAt?: string }
  >,
): Promise<Provider | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().updateProviderRecord(id, input);
  }
  return mutateDatabase((database) => {
    const provider = database.providers.find((entry) => entry.id === id);
    if (!provider) return null;
    Object.assign(provider, input);
    provider.updatedAt = nowIso();
    return provider;
  });
}

export async function getAppointmentRequestsByProvider(
  providerSlug: string,
): Promise<AppointmentRequest[]> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getAppointmentRequestsByProvider(providerSlug);
  }
  return mutateDatabase((database) => {
    return [...database.appointmentRequests]
      .filter((item) => item.providerSlug === providerSlug)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });
}

// ============================================================================
// BusinessEnquiry
// ============================================================================

export async function getBusinessEnquiries(): Promise<BusinessEnquiry[]> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getBusinessEnquiries();
  }
  return mutateDatabase((database) => {
    return [...database.businessEnquiries].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  });
}

export async function createBusinessEnquiryRecord(
  input: NewBusinessEnquiry,
): Promise<BusinessEnquiry> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().createBusinessEnquiryRecord(input);
  }
  return mutateDatabase((database) => {
    const timestamp = nowIso();
    const record: BusinessEnquiry = {
      ...input,
      id: randomUUID(),
      reference: makeReference("B"),
      status: "new",
      isSample: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    database.businessEnquiries.unshift(record);
    return record;
  });
}

export async function updateBusinessEnquiryStatus(
  id: string,
  status: BusinessEnquiryStatus,
): Promise<BusinessEnquiry | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().updateBusinessEnquiryStatus(id, status);
  }
  return mutateDatabase((database) => {
    const record = database.businessEnquiries.find((entry) => entry.id === id);
    if (!record) return null;
    record.status = status;
    record.updatedAt = nowIso();
    return record;
  });
}

// ============================================================================
// Correction
// ============================================================================

export async function getCorrections(): Promise<Correction[]> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getCorrections();
  }
  return mutateDatabase((database) => {
    return [...database.corrections].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  });
}

function currentValueFor(provider: Provider, field: CorrectionField): string {
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
  if (DATA_MODE === "postgres") {
    return getPostgresClient().createCorrectionRecord(input);
  }
  return mutateDatabase((database) => {
    const provider = database.providers.find(
      (entry) => entry.slug === input.providerSlug,
    );
    if (!provider) throw new Error("Provider not found");
    const timestamp = nowIso();
    const record: Correction = {
      ...input,
      id: randomUUID(),
      reference: makeReference("C"),
      providerName: provider.name,
      currentValue: currentValueFor(provider, input.field),
      status: "pending",
      isSample: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    database.corrections.unshift(record);
    return record;
  });
}

export async function resolveCorrectionRecord(
  id: string,
  decision: CorrectionDecision,
  reviewNote: string,
  actor: string,
): Promise<{ correction: Correction; providerUpdated: boolean } | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().resolveCorrectionRecord(id, decision, reviewNote, actor);
  }
  return mutateDatabase((database) => {
    const correction = database.corrections.find((entry) => entry.id === id);
    if (!correction) return null;
    if (correction.status !== "pending") {
      return { correction, providerUpdated: false };
    }

    const timestamp = nowIso();
    correction.status = decision;
    correction.reviewNote = reviewNote || undefined;
    correction.reviewedBy = actor;
    correction.reviewedAt = timestamp;
    correction.updatedAt = timestamp;

    let providerUpdated = false;
    if (decision === "approved") {
      const provider = database.providers.find(
        (entry) => entry.slug === correction.providerSlug,
      );
      if (provider) {
        switch (correction.field) {
          case "phone":
            provider.phone = correction.proposedValue;
            break;
          case "address":
            provider.address = correction.proposedValue;
            break;
          case "website":
            provider.website = correction.proposedValue;
            break;
          case "hours":
            provider.hours = correction.proposedValue;
            break;
          case "services":
            provider.services = correction.proposedValue
              .split(",")
              .map((service: string) => service.trim())
              .filter(Boolean);
            break;
        }
        provider.updatedAt = timestamp;
        provider.completeness = Math.min(100, provider.completeness + 1);
        providerUpdated = true;
      }
    }

    return { correction, providerUpdated };
  });
}

// ============================================================================
// EducationLead
// ============================================================================

export async function getEducationLeads(): Promise<EducationLead[]> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getEducationLeads();
  }
  return mutateDatabase((database) => {
    return [...database.educationLeads].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  });
}

export async function getEducationLeadByReference(
  reference: string,
): Promise<EducationLead | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getEducationLeadByReference(reference);
  }
  return mutateDatabase((database) => {
    return database.educationLeads.find((lead) => lead.reference === reference) ?? null;
  });
}

export async function createEducationLeadRecord(
  input: NewEducationLead,
): Promise<EducationLead> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().createEducationLeadRecord(input);
  }
  return mutateDatabase((database) => {
    const timestamp = nowIso();
    const record: EducationLead = {
      ...input,
      id: randomUUID(),
      reference: makeReference("E"),
      status: "new",
      source: "website",
      isSample: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    database.educationLeads.unshift(record);
    return record;
  });
}

export async function updateEducationLeadStatus(
  id: string,
  status: EducationLeadStatus,
): Promise<EducationLead | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().updateEducationLeadStatus(id, status);
  }
  return mutateDatabase((database) => {
    const record = database.educationLeads.find((entry) => entry.id === id);
    if (!record) return null;
    record.status = status;
    record.updatedAt = nowIso();
    return record;
  });
}

// ============================================================================
// ContentProject
// ============================================================================

export async function getContentProjects(): Promise<ContentProject[]> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getContentProjects();
  }
  return mutateDatabase((database) => {
    return [...database.contentProjects].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  });
}

export async function getContentProjectById(
  id: string,
): Promise<ContentProject | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getContentProjectById(id);
  }
  return mutateDatabase((database) => {
    return database.contentProjects.find((entry) => entry.id === id) ?? null;
  });
}

export async function createContentProjectRecord(
  input: NewContentProject,
): Promise<ContentProject> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().createContentProjectRecord(input);
  }
  return mutateDatabase((database) => {
    const timestamp = nowIso();
    const record: ContentProject = {
      ...input,
      id: randomUUID(),
      reference: makeReference("CS"),
      status: "in_review",
      source: "studio",
      isSample: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    database.contentProjects.unshift(record);
    return record;
  });
}

export async function updateContentProjectStatus(
  id: string,
  status: ContentStatus,
  actor: string,
  note?: string,
): Promise<ContentProject | null> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().updateContentProjectStatus(id, status, actor, note);
  }
  return mutateDatabase((database) => {
    const project = database.contentProjects.find((entry) => entry.id === id);
    if (!project) return null;
    project.status = status;
    project.updatedAt = nowIso();
    if (note) project.reviewNotes = note;
    if (status === "approved" || status === "changes_requested") {
      project.reviewerName = actor;
      project.review = Object.fromEntries(
        Object.entries(project.review).map(([key]) => [key, true]),
      ) as ContentProject["review"];
    }
    return project;
  });
}

// ============================================================================
// WorkflowRun
// ============================================================================

export async function getWorkflowRuns(): Promise<WorkflowRun[]> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getWorkflowRuns();
  }
  return mutateDatabase((database) => {
    return [...database.workflowRuns].sort((a, b) =>
      b.startedAt.localeCompare(a.startedAt),
    );
  });
}

export async function appendWorkflowRun(run: WorkflowRun): Promise<WorkflowRun> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().appendWorkflowRun(run);
  }
  return mutateDatabase((database) => {
    database.workflowRuns.unshift(run);
    return run;
  });
}

// ============================================================================
// AuditLog
// ============================================================================

export async function getAuditLogs(): Promise<AuditLog[]> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().getAuditLogs();
  }
  return mutateDatabase((database) => {
    return [...database.auditLogs].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  });
}

export async function appendAuditLog(
  entry: NewAuditLog,
): Promise<AuditLog> {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().appendAuditLog(entry);
  }
  return mutateDatabase((database) => {
    const record: AuditLog = {
      ...entry,
      id: randomUUID(),
      createdAt: nowIso(),
      isSample: false,
    };
    database.auditLogs.unshift(record);
    return record;
  });
}

export async function resetDemoDatabase(actor: string): Promise<void> {
  if (DATA_MODE === "postgres") {
    // In Postgres mode, reset is a no-op for safety (data is managed via migrations)
    await appendAuditLog({
      actor,
      action: "demo.reset",
      entityType: "database",
      entityId: "demo",
      detail: "Demo reset requested but Postgres mode does not auto-reset. Use SQL TRUNCATE if needed.",
    });
    return;
  }
  return mutateDatabase((database) => {
    const seed = createSeedDatabase();
    database.providers = seed.providers;
    database.businessEnquiries = seed.businessEnquiries;
    database.corrections = seed.corrections;
    database.educationLeads = seed.educationLeads;
    database.contentProjects = seed.contentProjects;
    database.businessListings = seed.businessListings;
    database.appointmentRequests = seed.appointmentRequests;
    database.animals = seed.animals;
    database.workflowRuns = seed.workflowRuns;
    database.auditLogs = seed.auditLogs;
  });
}

export function makeDemoReference(prefix: "B" | "C" | "E" | "CS") {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().makeDemoReference(prefix);
  }
  return makeReference(prefix);
}

export function currentTimestamp() {
  if (DATA_MODE === "postgres") {
    return getPostgresClient().currentTimestamp();
  }
  return nowIso();
}
