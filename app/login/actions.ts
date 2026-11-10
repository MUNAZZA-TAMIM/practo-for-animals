"use server";

import { redirect } from "next/navigation";
import { authenticateDemoUser } from "@/lib/auth/demo-accounts";
import { createSession, destroySession, getSession } from "@/lib/auth/session";
import { getClientIdentifier } from "@/lib/request";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";
import { safeRedirectPath } from "@/lib/utils";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
};

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeRedirectPath(
    typeof formData.get("next") === "string"
      ? String(formData.get("next"))
      : undefined,
    "/dashboard",
  );

  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  if (email.length > 160 || password.length > 200) {
    return { status: "error", message: "Those credentials are not valid." };
  }

  const identifier = await getClientIdentifier();
  const limit = rateLimit(rateLimitKey("login", identifier), 5, 10 * 60_000);
  if (!limit.ok) {
    return {
      status: "error",
      message: `Too many sign-in attempts. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
    };
  }

  const account = authenticateDemoUser(email, password);
  if (!account) {
    return {
      status: "error",
      message:
        "Email or password does not match a demo account. Use one of the quick-fill options below.",
    };
  }

  await createSession(account);
  redirect(next);
}

export async function logoutAction() {
  await destroySession();
  redirect("/login?notice=signed-out");
}

export async function redirectIfSignedIn(nextPath = "/dashboard") {
  const session = await getSession();
  if (session) redirect(safeRedirectPath(nextPath, "/dashboard"));
}
