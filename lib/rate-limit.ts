import "server-only";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: limit - existing.count,
    retryAfterSeconds: 0,
  };
}

export function resetRateLimits() {
  buckets.clear();
}

/**
 * In-memory buckets are a demo-grade safeguard. Use a shared Redis/Upstash
 * limiter in production so limits survive serverless instances.
 */
export function rateLimitKey(scope: string, identifier: string) {
  return `${scope}:${identifier}`;
}
