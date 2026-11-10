import { z } from "zod";
import {
  PROVIDER_CATEGORIES,
  type ProviderCategory,
} from "@/lib/data/providers";
import {
  DESIGN_DIRECTIONS,
  STUDIO_AUDIENCES,
  STUDIO_CHANNELS,
  STUDIO_TONES,
  type DesignDirectionId,
  type StudioAudience,
  type StudioChannel,
  type StudioTone,
} from "@/lib/studio/data";

const categoryValues = PROVIDER_CATEGORIES.map(
  (category) => category.value,
) as [ProviderCategory, ...ProviderCategory[]];

const audienceValues = STUDIO_AUDIENCES.map(
  (audience) => audience.value,
) as [StudioAudience, ...StudioAudience[]];

const channelValues = STUDIO_CHANNELS.map(
  (channel) => channel.value,
) as [StudioChannel, ...StudioChannel[]];

const toneValues = STUDIO_TONES.map(
  (tone) => tone.value,
) as [StudioTone, ...StudioTone[]];

const designDirectionValues = DESIGN_DIRECTIONS.map(
  (direction) => direction.id,
) as [DesignDirectionId, ...DesignDirectionId[]];

const optionalHttpUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) =>
      value === "" || /^https?:\/\/[^\s]+$/i.test(value),
    "Enter a full URL starting with http:// or https://",
  )
  .optional();

const consent = z.preprocess(
  (value) => value === "on" || value === "true" || value === true,
  z.boolean().refine((value) => value === true, {
    message: "Please confirm consent to continue",
  }),
);

const phone = z
  .string()
  .trim()
  .min(8, "Enter a contact number")
  .max(24)
  .regex(/^[+()\d\s-]+$/, "Use digits, spaces, +, ( ) or - only");

const safeName = z
  .string()
  .trim()
  .min(2, "Enter at least 2 characters")
  .max(80)
  .regex(/^[\p{L}\p{M}' .-]+$/u, "Use letters, spaces, apostrophes or hyphens");

export const businessEnquirySchema = z.object({
  contactName: safeName,
  businessName: z.string().trim().min(2, "Enter your business name").max(120),
  category: z.enum(categoryValues, { message: "Choose a care category" }),
  city: z.string().trim().min(2, "Choose a city").max(60),
  area: z.string().trim().min(2, "Enter your area or neighbourhood").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(160),
  phone,
  website: optionalHttpUrl,
  services: z
    .string()
    .trim()
    .min(10, "Tell us about the services you offer")
    .max(500),
  species: z.string().trim().min(2, "List the species you work with").max(300),
  message: z.string().trim().max(1500).optional().default(""),
  consent,
  companyWebsite: z.string().max(0).optional().default(""),
});

export const correctionSchema = z.object({
  providerSlug: z.string().trim().min(2, "Choose a provider").max(120),
  field: z.enum(["phone", "address", "website", "hours", "services", "other"], {
    message: "Choose the information that needs correcting",
  }),
  proposedValue: z
    .string()
    .trim()
    .min(3, "Describe the corrected information")
    .max(800),
  evidenceUrl: optionalHttpUrl,
  note: z.string().trim().max(1000).optional().default(""),
  submitterName: safeName,
  submitterEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(160),
  consent,
  companyWebsite: z.string().max(0).optional().default(""),
});

export const educationLeadSchema = z.object({
  fullName: safeName,
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(160),
  phone: z
    .string()
    .trim()
    .max(24)
    .regex(/^[+()\d\s-]*$/, "Use digits, spaces, +, ( ) or - only")
    .optional()
    .or(z.literal("")),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  role: z.enum(
    [
      "veterinarian",
      "veterinary-nurse",
      "clinic-owner",
      "animal-ngo",
      "pet-care-founder",
      "marketer",
      "other",
    ],
    { message: "Choose the option that fits you best" },
  ),
  organisation: z.string().trim().max(120).optional().or(z.literal("")),
  programmeSlug: z.string().trim().min(2, "Choose a programme").max(120),
  goals: z.string().trim().max(1000).optional().or(z.literal("")),
  consent,
  companyWebsite: z.string().max(0).optional().default(""),
});

export const studioBriefSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(8, "Give the idea a little more detail")
    .max(180, "Keep the idea under 180 characters"),
  goal: z.string().trim().max(300).optional().default(""),
  audience: z.enum(audienceValues),
  channel: z.enum(channelValues),
  tone: z.enum(toneValues),
  slideCount: z.number().int().min(4).max(10),
});

export const researchDeckSchema = z.object({
  summary: z.string().min(1).max(2000),
  keyPoints: z.array(z.string().max(600)).max(12),
  cautions: z.array(z.string().max(600)).max(12),
  questions: z.array(z.string().max(600)).max(12),
  angles: z.array(z.string().max(600)).max(12),
  checks: z.array(z.string().max(600)).max(12),
  engine: z.enum(["n8n", "local-demo", "local-fallback"]),
  warning: z.string().max(600).optional(),
  generatedAt: z.string().optional(),
});

export const outlineItemSchema = z.object({
  id: z.string().min(1).max(40),
  title: z.string().trim().min(1).max(140),
  purpose: z.string().trim().max(240),
  keyPoint: z.string().trim().max(500),
});

export const studioSlideSchema = z.object({
  id: z.string().min(1).max(40),
  kicker: z.string().max(100).default(""),
  title: z.string().trim().min(1, "Every slide needs a title").max(140),
  body: z.string().trim().min(1, "Every slide needs some body copy").max(1500),
  cta: z.string().max(80).optional().default(""),
  imageNote: z.string().max(300).optional().default(""),
});

export const reviewChecklistSchema = z.object({
  claims: z.boolean(),
  medical: z.boolean(),
  tone: z.boolean(),
  design: z.boolean(),
  safety: z.boolean(),
  approval: z.boolean(),
});

export const saveContentProjectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  brief: studioBriefSchema,
  research: researchDeckSchema,
  outline: z.array(outlineItemSchema).min(1).max(12),
  slides: z.array(studioSlideSchema).min(4).max(10),
  designDirection: z.enum(designDirectionValues),
  review: reviewChecklistSchema,
  reviewerName: z.string().trim().min(2, "Add the reviewer's name").max(80),
  reviewNotes: z.string().trim().max(1000).optional().default(""),
  companyWebsite: z.string().max(0).optional().default(""),
});

export const researchRequestSchema = studioBriefSchema;

export const statusUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.string().min(2).max(40),
});

export const correctionDecisionSchema = z.object({
  id: z.string().min(1),
  decision: z.enum(["approved", "rejected"]),
  reviewNote: z.string().trim().max(1000).optional().default(""),
});

export const providerStatusSchema = z.object({
  id: z.string().min(1),
  action: z.enum(["publish", "pause", "feature", "unfeature"]),
});

export const contentDecisionSchema = z.object({
  id: z.string().min(1),
  decision: z.enum(["approve", "request_changes", "mark_exported"]),
  note: z.string().trim().max(1000).optional().default(""),
});

export type BusinessEnquiryInput = z.infer<typeof businessEnquirySchema>;
export type CorrectionInput = z.infer<typeof correctionSchema>;
export type EducationLeadInput = z.infer<typeof educationLeadSchema>;
export type SaveContentProjectInput = z.infer<typeof saveContentProjectSchema>;
export type StudioBriefInput = z.infer<typeof studioBriefSchema>;

// --- Business Listing Registration Schema ---

const postalCode = z
  .string()
  .trim()
  .min(3, "Enter a valid postal code")
  .max(20)
  .regex(/^[A-Za-z0-9\s-]+$/, "Use letters, numbers, spaces or hyphens only")
  .optional();

const stateValue = z.string().trim().min(2, "Enter a state or province").max(80).optional();

const countryValue = z.string().trim().min(2, "Enter a country").max(80).optional();

export const businessListingSchema = z.object({
  businessName: z.string().trim().min(2, "Enter your business name").max(120),
  category: z.enum(categoryValues, { message: "Choose a care category" }),
  description: z
    .string()
    .trim()
    .min(10, "Tell us about your animal-care services")
    .max(1000, "Keep the description under 1000 characters"),
  services: z
    .array(z.string().min(1).max(100))
    .min(1, "Select at least one service")
    .max(20),
  animalsSupported: z
    .array(z.string().min(1).max(50))
    .min(1, "Select at least one animal type")
    .max(20),
  addressLine1: z.string().trim().min(2, "Enter your address").max(200),
  addressLine2: z.string().trim().max(200).optional().default(""),
  city: z.string().trim().min(2, "Enter your city").max(80),
  state: stateValue,
  postalCode,
  country: countryValue.default("India"),
  phone: phone,
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(160),
  website: optionalHttpUrl,
  contactPerson: z.string().trim().min(2).max(80).optional().default(""),
  businessHours: z.string().trim().max(200).optional().default(""),
  additionalInformation: z.string().trim().max(1000).optional().default(""),
  appointmentInformation: z.string().trim().max(500).optional().default(""),
  emergencyServiceInformation: z.string().trim().max(500).optional().default(""),
  consent: consent,
  companyWebsite: z.string().max(0).optional().default(""),
});

// --- Appointment Request Schema ---

export const appointmentRequestSchema = z.object({
  providerSlug: z.string().trim().min(1, "Choose a provider"),
  service: z.string().trim().min(1, "Choose a service"),
  serviceDescription: z.string().trim().max(500).optional().default(""),
  animalName: safeName,
  animalSpecies: z.string().trim().min(2, "Select an animal type").max(50),
  animalAge: z.string().trim().max(50).optional().default(""),
  reasonForVisit: z.string().trim().max(1000).optional().default(""),
  preferredDate: z.string().trim().min(1, "Choose a date"),
  preferredTime: z.string().trim().min(1, "Choose a time"),
  contactName: safeName,
  contactEmail: z.string().trim().toLowerCase().email("Enter a valid email address").max(160),
  contactPhone: phone,
  consent: consent,
});

export type AppointmentRequestInput = z.infer<typeof appointmentRequestSchema>;

// --- Animal Management Schemas ---

export const animalCreateSchema = z.object({
  name: safeName,
  species: z.string().trim().min(2, "Select an animal type").max(50),
  breed: z.string().trim().max(80).optional().default(""),
  age: z.string().trim().max(50).optional().default(""),
  notes: z.string().trim().max(1000).optional().default(""),
});

export const animalUpdateSchema = animalCreateSchema.partial();

export const appointmentCancelSchema = z.object({
  id: z.string().min(1),
  reason: z.string().trim().max(500).optional().default(""),
});

export type AnimalCreateInput = z.infer<typeof animalCreateSchema>;
export type AnimalUpdateInput = z.infer<typeof animalUpdateSchema>;
export type AppointmentCancelInput = z.infer<typeof appointmentCancelSchema>;

// --- Provider Authentication Schemas ---

export const providerLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(160),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

// --- Provider Listing Edit Schema ---

export const providerListingEditSchema = z.object({
  name: z.string().trim().min(2, "Enter your business name").max(120),
  category: z.enum(categoryValues, { message: "Choose a care category" }),
  about: z.string().trim().min(10, "Tell us about your animal-care services").max(1000),
  address: z.string().trim().min(2, "Enter your address").max(200),
  phone,
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(160).optional().default(""),
  website: optionalHttpUrl,
  hours: z.string().trim().min(2, "Enter your opening hours").max(200),
  services: z.array(z.string().min(1).max(100)).min(1, "Select at least one service").max(20),
  species: z.array(z.string().min(1).max(50)).min(1, "Select at least one animal type").max(20),
  priceNote: z.string().trim().max(500).optional().default(""),
});

export type ProviderLoginInput = z.infer<typeof providerLoginSchema>;
export type ProviderListingEditInput = z.infer<typeof providerListingEditSchema>;
