import type {
  DesignDirectionId,
  OutlineItem,
  ResearchDeck,
  ReviewChecklist,
  StudioBrief,
  StudioSlide,
} from "@/lib/studio/data";

export type BusinessEnquiryStatus = "new" | "in_review" | "contacted" | "closed";
export type CorrectionStatus = "pending" | "approved" | "rejected";
export type CorrectionDecision = "approved" | "rejected";
export type CorrectionField =
  | "phone"
  | "address"
  | "website"
  | "hours"
  | "services"
  | "other";
export type EducationLeadStatus = "new" | "contacted" | "enrolled" | "closed";

export type AppointmentStatus = "pending" | "approved" | "rejected" | "completed" | "cancelled";

export type AppointmentRequest = {
  id: string;
  reference: string;
  providerSlug: string;
  providerName: string;
  category: string;
  city: string;
  area: string;
  service: string;
  serviceDescription?: string;
  animalName: string;
  animalSpecies: string;
  animalAge?: string;
  reasonForVisit?: string;
  preferredDate: string;
  preferredTime: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  consent: boolean;
  userId?: string;
  status: AppointmentStatus;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewAppointmentRequest = Omit<
  AppointmentRequest,
  "id" | "reference" | "status" | "isSample" | "createdAt" | "updatedAt"
>;

export type Animal = {
  id: string;
  userId: string;
  name: string;
  species: string;
  breed?: string;
  age?: string;
  notes?: string;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewAnimal = Omit<Animal, "id" | "isSample" | "createdAt" | "updatedAt">;

export type ContentStatus =
  | "draft"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "exported";
export type WorkflowStatus =
  | "queued"
  | "running"
  | "completed"
  | "needs_attention"
  | "failed";
export type WorkflowMode = "demo-adapter" | "n8n" | "local-fallback";
export type WorkflowStepStatus =
  | "pending"
  | "running"
  | "completed"
  | "simulated"
  | "failed";
export type WorkflowKind =
  | "provider-intake"
  | "correction-review"
  | "education-enquiry"
  | "content-generation"
  | "appointment-request";

export type WorkflowStep = {
  name: string;
  status: WorkflowStepStatus;
  at?: string;
  detail?: string;
};

export type WorkflowRun = {
  id: string;
  workflow: WorkflowKind;
  subjectType:
    | "business_enquiry"
    | "correction"
    | "education_lead"
    | "content_project";
  subjectId: string;
  subjectLabel: string;
  status: WorkflowStatus;
  mode: WorkflowMode;
  steps: WorkflowStep[];
  error?: string;
  startedAt: string;
  finishedAt?: string;
  isSample: boolean;
};

export type BusinessEnquiry = {
  id: string;
  reference: string;
  contactName: string;
  businessName: string;
  category: string;
  city: string;
  area: string;
  email: string;
  phone: string;
  website?: string;
  services: string;
  species: string;
  message: string;
  consent: boolean;
  status: BusinessEnquiryStatus;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Correction = {
  id: string;
  reference: string;
  providerSlug: string;
  providerName: string;
  field: CorrectionField;
  currentValue: string;
  proposedValue: string;
  evidenceUrl?: string;
  note: string;
  submitterName: string;
  submitterEmail: string;
  status: CorrectionStatus;
  reviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EducationLead = {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  role: string;
  organisation?: string;
  programmeSlug: string;
  programmeName: string;
  goals: string;
  consent: boolean;
  status: EducationLeadStatus;
  source: string;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ContentProject = {
  id: string;
  reference: string;
  title: string;
  brief: StudioBrief;
  research: ResearchDeck;
  outline: OutlineItem[];
  slides: StudioSlide[];
  designDirection: DesignDirectionId;
  review: ReviewChecklist;
  reviewerName: string;
  reviewNotes: string;
  status: ContentStatus;
  source: "studio" | "seed";
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  detail: string;
  createdAt: string;
  isSample: boolean;
};

export type NewAuditLog = Omit<AuditLog, "id" | "isSample" | "createdAt">;

export type DemoDatabase = {
  version: number;
  meta: {
    seededAt: string;
    isSampleData: true;
    app: string;
  };
  providers: import("@/lib/data/providers").Provider[];
  businessEnquiries: BusinessEnquiry[];
  corrections: Correction[];
  educationLeads: EducationLead[];
  contentProjects: ContentProject[];
  businessListings: BusinessListing[];
  appointmentRequests: AppointmentRequest[];
  animals: Animal[];
  workflowRuns: WorkflowRun[];
  auditLogs: AuditLog[];
};

export type NewBusinessEnquiry = Omit<
  BusinessEnquiry,
  "id" | "reference" | "status" | "isSample" | "createdAt" | "updatedAt"
>;

export type NewCorrection = Omit<
  Correction,
  | "id"
  | "reference"
  | "status"
  | "currentValue"
  | "providerName"
  | "reviewNote"
  | "reviewedBy"
  | "reviewedAt"
  | "isSample"
  | "createdAt"
  | "updatedAt"
>;

export type NewEducationLead = Omit<
  EducationLead,
  "id" | "reference" | "status" | "source" | "isSample" | "createdAt" | "updatedAt"
>;

export type NewContentProject = Omit<
  ContentProject,
  | "id"
  | "reference"
  | "status"
  | "source"
  | "isSample"
  | "createdAt"
  | "updatedAt"
>;

// --- Business Listing types ---

export type BusinessListingStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "published";

export type BusinessListing = {
  id: string;
  reference: string;
  businessName: string;
  category: string;
  description: string;
  services: string[];
  animalsSupported: string[];
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  contactPerson?: string;
  businessHours?: string;
  additionalInformation?: string;
  appointmentInformation?: string;
  emergencyServiceInformation?: string;
  consent: boolean;
  status: BusinessListingStatus;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewBusinessListing = Omit<
  BusinessListing,
  "id" | "reference" | "status" | "isSample" | "createdAt" | "updatedAt"
>;
