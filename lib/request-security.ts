type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfter: number;
};

const globalRateLimit = globalThis as typeof globalThis & {
  coroRateLimits?: Map<string, RateLimitEntry>;
};

const rateLimits = globalRateLimit.coroRateLimits ?? new Map<string, RateLimitEntry>();
globalRateLimit.coroRateLimits = rateLimits;

export function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const expectedHost = forwardedHost || request.headers.get("host") || requestUrl.host;
    const expectedProtocol = forwardedProtocol || requestUrl.protocol.replace(":", "");

    return originUrl.host === expectedHost && originUrl.protocol === `${expectedProtocol}:`;
  } catch {
    return false;
  }
}

export function checkRateLimit(request: Request, scope: string, maximum: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientAddress = (forwardedFor || request.headers.get("x-real-ip") || "unknown").slice(0, 100);
  const key = `${scope}:${clientAddress}`;
  const current = rateLimits.get(key);

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= maximum) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }

  current.count += 1;

  if (rateLimits.size > 5_000) {
    for (const [storedKey, entry] of rateLimits) {
      if (entry.resetAt <= now) rateLimits.delete(storedKey);
    }
    if (rateLimits.size > 5_000) rateLimits.clear();
  }

  return { allowed: true, retryAfter: 0 };
}

export async function readJsonObject(request: Request, maximumBytes: number) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return { error: "invalid" as const };
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    return { error: "too-large" as const };
  }

  try {
    const text = await request.text();
    if (Buffer.byteLength(text, "utf8") > maximumBytes) return { error: "too-large" as const };
    const value = JSON.parse(text) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) return { error: "invalid" as const };
    return { data: value as Record<string, unknown> };
  } catch {
    return { error: "invalid" as const };
  }
}

export function securityError(message: string, status: number, retryAfter?: number) {
  const headers: Record<string, string> = { "cache-control": "no-store" };
  if (retryAfter) headers["retry-after"] = String(retryAfter);
  return Response.json({ success: false, message }, { status, headers });
}
