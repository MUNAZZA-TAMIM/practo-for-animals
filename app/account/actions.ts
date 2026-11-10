"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  cancelAppointmentRequest,
  createAnimal,
  deleteAnimal,
  updateAnimal,
} from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import {
  animalCreateSchema,
  animalUpdateSchema,
  appointmentCancelSchema,
} from "@/lib/validation/schemas";

export async function cancelAppointmentAction(
  _prev: { status: "idle" | "error"; message?: string },
  formData: FormData,
): Promise<{ status: "idle" | "error"; message?: string }> {
  const session = await requireUser("/account");
  const parsed = appointmentCancelSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    reason: String(formData.get("reason") ?? ""),
  });
  if (!parsed.success) {
    return { status: "error", message: "Invalid cancellation request." };
  }
  try {
    const record = await cancelAppointmentRequest(
      parsed.data.id,
      session.email,
    );
    if (!record) {
      return { status: "error", message: "Appointment not found." };
    }
    revalidatePath("/account");
    revalidatePath("/account/appointments");
    return { status: "idle" };
  } catch {
    return { status: "error", message: "Unable to cancel appointment." };
  }
}

export async function createAnimalAction(
  _prev: { status: "idle" | "error"; message?: string },
  formData: FormData,
): Promise<{ status: "idle" | "error"; message?: string }> {
  const session = await requireUser("/account");
  const parsed = animalCreateSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    species: String(formData.get("species") ?? ""),
    breed: String(formData.get("breed") ?? ""),
    age: String(formData.get("age") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  });
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields." };
  }
  try {
    await createAnimal({
      userId: session.sub,
      ...parsed.data,
    });
    revalidatePath("/account");
    revalidatePath("/account/animals");
    return { status: "idle" };
  } catch {
    return { status: "error", message: "Unable to add animal. Try again." };
  }
}

export async function updateAnimalAction(
  _prev: { status: "idle" | "error"; message?: string },
  formData: FormData,
): Promise<{ status: "idle" | "error"; message?: string }> {
  const session = await requireUser("/account");
  const id = String(formData.get("id") ?? "");
  const parsed = animalUpdateSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    species: String(formData.get("species") ?? ""),
    breed: String(formData.get("breed") ?? ""),
    age: String(formData.get("age") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  });
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields." };
  }
  try {
    const record = await updateAnimal(id, parsed.data, session.sub);
    if (!record) {
      return { status: "error", message: "Animal not found." };
    }
    revalidatePath("/account");
    revalidatePath("/account/animals");
    return { status: "idle" };
  } catch {
    return { status: "error", message: "Unable to update animal. Try again." };
  }
}

export async function deleteAnimalAction(
  _prev: { status: "idle" | "error"; message?: string },
  formData: FormData,
): Promise<{ status: "idle" | "error"; message?: string }> {
  const session = await requireUser("/account");
  const id = String(formData.get("id") ?? "");
  try {
    const ok = await deleteAnimal(id, session.sub);
    if (!ok) {
      return { status: "error", message: "Animal not found." };
    }
    revalidatePath("/account");
    revalidatePath("/account/animals");
    return { status: "idle" };
  } catch {
    return { status: "error", message: "Unable to delete animal. Try again." };
  }
}
