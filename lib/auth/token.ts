import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "./demo-accounts";

export const SESSION_COOKIE = "pfa_session";
export const SESSION_MAX_AGE = 60 * 60 * 8;

export type SessionUser = {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  providerId?: string;
};

const issuer = "practo-for-animals-demo";
const audience = "pfa-session";

function getSecret() {
  const secret =
    process.env.AUTH_SECRET ??
    "pfa-local-demo-secret-do-not-use-in-production-2026";
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(user: SessionUser) {
  const claims: Record<string, unknown> = {
    name: user.name,
    email: user.email,
    role: user.role,
  };
  if (user.providerId) claims.providerId = user.providerId;
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.sub)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer,
      audience,
    });
    if (
      typeof payload.sub !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "founder" && payload.role !== "admin" && payload.role !== "provider")
    ) {
      return null;
    }
    return {
      sub: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      providerId: typeof payload.providerId === "string" ? payload.providerId : undefined,
    };
  } catch {
    return null;
  }
}

export function isAuthSecretConfigured() {
  return Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32);
}
