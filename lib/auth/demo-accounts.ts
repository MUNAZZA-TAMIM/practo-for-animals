import "server-only";

import { timingSafeEqual } from "node:crypto";

export type UserRole = "founder" | "admin" | "provider";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  providerId?: string;
};

function envOr(value: string | undefined, fallback: string) {
  return value && value.trim().length > 0 ? value : fallback;
}

export function getDemoAccounts(): DemoUser[] {
  return [
    {
      id: "user-founder-munazza",
      name: "Munazza",
      email: envOr(process.env.DEMO_FOUNDER_EMAIL, "munazza2026@gmail.com"),
      password: envOr(process.env.DEMO_FOUNDER_PASSWORD, "munazza@2026"),
      role: "founder",
    },
    {
      id: "user-admin-sankar",
      name: "Sankar",
      email: envOr(process.env.DEMO_ADMIN_EMAIL, "sankar2026@gmail.com"),
      password: envOr(process.env.DEMO_ADMIN_PASSWORD, "sankar@2026"),
      role: "admin",
    },
    {
      id: "user-provider-cedar",
      name: "Dr. Arjun Mehta",
      email: envOr(process.env.DEMO_PROVIDER_EMAIL, "dr.mehta@cedarclover.example"),
      password: envOr(process.env.DEMO_PROVIDER_PASSWORD, "clinic@2026"),
      role: "provider",
      providerId: "prov-cedar-clover",
    },
  ];
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    // Still perform a comparison to reduce trivial length timing signal.
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

export function authenticateDemoUser(email: string, password: string) {
  const normalisedEmail = email.trim().toLowerCase();
  const account = getDemoAccounts().find(
    (candidate) => candidate.email.toLowerCase() === normalisedEmail,
  );
  if (!account) {
    safeEqual(password, "not-a-real-password");
    return null;
  }
  if (!safeEqual(password, account.password)) return null;
  return account;
}

export function getPublicDemoAccounts() {
  return getDemoAccounts().map(({ name, email, password, role }) => ({
    name,
    email,
    password,
    role,
  }));
}
