import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSessionToken,
  verifySessionToken,
  type SessionUser,
} from "./token";
import type { DemoUser, UserRole } from "./demo-accounts";

export type { SessionUser, UserRole };

export async function createSession(account: DemoUser) {
  const token = await signSessionToken({
    sub: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    providerId: account.providerId,
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireUser(nextPath = "/dashboard"): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireUser("/admin");
  if (session.role !== "admin") {
    redirect("/dashboard?notice=admin-only");
  }
  return session;
}

export async function assertUser(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("You need to sign in to do that.");
  }
  return session;
}

export async function assertAdmin(): Promise<SessionUser> {
  const session = await assertUser();
  if (session.role !== "admin") {
    throw new Error("Administrator access is required.");
  }
  return session;
}

export async function requireProvider(nextPath = "/provider-dashboard"): Promise<SessionUser> {
  const session = await requireUser(nextPath);
  if (session.role !== "provider") {
    redirect("/dashboard?notice=provider-only");
  }
  if (!session.providerId) {
    redirect("/provider-login?notice=account-setup");
  }
  return session;
}

export async function assertProvider(): Promise<SessionUser> {
  const session = await assertUser();
  if (session.role !== "provider") {
    throw new Error("Provider access is required.");
  }
  if (!session.providerId) {
    throw new Error("Provider account is not linked to a listing.");
  }
  return session;
}
