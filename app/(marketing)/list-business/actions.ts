"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { businessEnquirySchema, businessListingSchema } from "@/lib/validation/schemas";
import {
  appendAuditLog,
  appendWorkflowRun,
  createBusinessEnquiryRecord,
  createBusinessListingRecord,
  currentTimestamp,
} from "@/lib/db";
import { getClientIdentifier, isHoneypotFilled } from "@/lib/request";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";

export type BusinessFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  reference?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitBusinessEnquiry(
  _previous: BusinessFormState,
  formData: FormData,
): Promise<BusinessFormState> {
  if (isHoneypotFilled(formData.get("companyWebsite"))) {
    return {
      status: "error",
      message: "We couldn’t process this submission. Please try again.",
    };
  }

  const identifier = await getClientIdentifier();
  const limit = rateLimit(rateLimitKey("business-enquiry", identifier), 4, 30 * 60_000);
  if (!limit.ok) {
    return {
      status: "error",
      message: `Too many submissions from this connection. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
    };
  }

  const parsed = businessEnquirySchema.safeParse(
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
    const record = await createBusinessEnquiryRecord({
      contactName: parsed.data.contactName,
      businessName: parsed.data.businessName,
      category: parsed.data.category,
      city: parsed.data.city,
      area: parsed.data.area,
      email: parsed.data.email,
      phone: parsed.data.phone,
      website: parsed.data.website || undefined,
      services: parsed.data.services,
      species: parsed.data.species,
      message: parsed.data.message ?? "",
      consent: parsed.data.consent,
    });

    const now = currentTimestamp();
    await appendWorkflowRun({
      id: randomUUID(),
      workflow: "provider-intake",
      subjectType: "business_enquiry",
      subjectId: record.id,
      subjectLabel: record.businessName,
      status: "completed",
      mode: "demo-adapter",
      steps: [
        {
          name: "Enquiry validated and stored",
          status: "completed",
          at: now,
          detail: "Zod validation and local JSON persistence completed.",
        },
        {
          name: "Review queue updated",
          status: "completed",
          at: now,
          detail: "Visible in the founder dashboard under enquiries.",
        },
        {
          name: "Notification",
          status: "simulated",
          at: now,
          detail: "No email or n8n webhook is configured in this environment.",
        },
      ],
      startedAt: now,
      finishedAt: now,
      isSample: false,
    });

    await appendAuditLog({
      actor: "public:provider-enquiry",
      action: "business_enquiry.created",
      entityType: "business_enquiry",
      entityId: record.id,
      detail: `Provider enquiry ${record.reference} stored for review.`,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/enquiries");

    return {
      status: "success",
      reference: record.reference,
      message: "Your enquiry has been stored for review.",
    };
  } catch (error) {
    console.error(
      "[business-enquiry] Failed to store submission",
      error instanceof Error ? error.message : "unknown error",
    );
    return {
      status: "error",
      message:
        "Something went wrong while saving your enquiry. Please try again in a moment.",
    };
  }
}

export type BusinessListingState = {
  status: "idle" | "error" | "success";
  message?: string;
  reference?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitBusinessListing(
  _previous: BusinessListingState,
  formData: FormData,
): Promise<BusinessListingState> {
  if (isHoneypotFilled(formData.get("companyWebsite"))) {
    return {
      status: "error",
      message: "We couldn’t process this submission. Please try again.",
    };
  }

  const identifier = await getClientIdentifier();
  const limit = rateLimit(
    rateLimitKey("business-listing", identifier),
    30,
    30 * 60_000,
  );
  if (!limit.ok) {
    return {
      status: "error",
      message: `Too many submissions from this connection. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
    };
  }

  // Build a plain object from FormData; multi-select fields come as arrays.
  const raw = Object.fromEntries(formData.entries()) as Record<string, unknown>;
  const parsed = businessListingSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const record = await createBusinessListingRecord({
      businessName: parsed.data.businessName,
      category: parsed.data.category,
      description: parsed.data.description,
      services: parsed.data.services,
      animalsSupported: parsed.data.animalsSupported,
      addressLine1: parsed.data.addressLine1,
      addressLine2: parsed.data.addressLine2 || undefined,
      city: parsed.data.city,
      state: parsed.data.state || undefined,
      postalCode: parsed.data.postalCode || undefined,
      country: parsed.data.country,
      phone: parsed.data.phone,
      email: parsed.data.email,
      website: parsed.data.website || undefined,
      contactPerson: parsed.data.contactPerson || undefined,
      businessHours: parsed.data.businessHours || undefined,
      additionalInformation: parsed.data.additionalInformation || undefined,
      appointmentInformation: parsed.data.appointmentInformation || undefined,
      emergencyServiceInformation:
        parsed.data.emergencyServiceInformation || undefined,
      consent: parsed.data.consent,
    });

    const now = currentTimestamp();
    await appendWorkflowRun({
      id: randomUUID(),
      workflow: "provider-intake",
      subjectType: "business_enquiry",
      subjectId: record.id,
      subjectLabel: record.businessName,
      status: "completed",
      mode: "demo-adapter",
      steps: [
        {
          name: "Listing validated and stored",
          status: "completed",
          at: now,
          detail: "Zod validation and local JSON persistence completed.",
        },
        {
          name: "Review queue updated",
          status: "completed",
          at: now,
          detail: "Visible in the founder dashboard under business listings.",
        },
        {
          name: "Notification",
          status: "simulated",
          at: now,
          detail: "No email or n8n webhook is configured in this environment.",
        },
      ],
      startedAt: now,
      finishedAt: now,
      isSample: false,
    });

    await appendAuditLog({
      actor: "public:provider-listing",
      action: "business_listing.created",
      entityType: "business_listing",
      entityId: record.id,
      detail: `Business listing ${record.reference} stored for review.`,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/enquiries");

    return {
      status: "success",
      reference: record.reference,
      message: "Your listing has been submitted for review.",
    };
  } catch (error) {
    console.error(
      "[business-listing] Failed to store submission",
      error instanceof Error ? error.message : "unknown error",
    );
    return {
      status: "error",
      message:
        "Something went wrong while saving your listing. Please try again in a moment.",
    };
  }
}
