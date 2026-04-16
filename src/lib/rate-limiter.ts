/**
 * In-Memory Sliding Window Rate Limiter
 *
 * Protects API routes from overuse and API key exhaustion.
 * Works in Next.js Edge/Node runtimes without any external dependencies.
 *
 * Usage:
 *   const result = rateLimiter.check(req, "chat");
 *   if (!result.allowed) return rateLimitResponse(result);
 */

import { NextRequest, NextResponse } from "next/server";

// ─── Config ──────────────────────────────────────────────────────────────────

/**
 * Define per-route limits.
 * key    = route name token (matched against URL)
 * limit  = max requests allowed in `windowMs`
 * windowMs = sliding window duration in milliseconds
 */
export const RATE_LIMIT_CONFIGS: Record<
  string,
  { limit: number; windowMs: number; label: string }
> = {
  // AI chat: expensive — LLM token spend per call
  chat: {
    limit: 15,
    windowMs: 60 * 1000,       // 15 req / min per IP
    label: "AI Chat",
  },
  // Market intelligence: hits 3 RapidAPI endpoints + LLM
  "market-intelligence": {
    limit: 6,
    windowMs: 60 * 1000,       // 6 req / min per IP
    label: "Market Intelligence",
  },
  // Skill vector: hits 3 RapidAPI endpoints + LLM
  "skill-vector": {
    limit: 6,
    windowMs: 60 * 1000,       // 6 req / min per IP
    label: "Skill Vector",
  },
  // Resume parsing: Gemini multimodal — moderate cost
  "parse-resume": {
    limit: 5,
    windowMs: 60 * 1000,       // 5 req / min per IP
    label: "Resume Parser",
  },
  // Jobs sync: hits multiple RapidAPI endpoints
  "jobs/sync": {
    limit: 4,
    windowMs: 60 * 1000,       // 4 req / min per IP
    label: "Jobs Sync",
  },
  // Adzuna jobs: external API call
  "jobs/adzuna": {
    limit: 10,
    windowMs: 60 * 1000,       // 10 req / min per IP
    label: "Adzuna Jobs",
  },
  // Roadmap generation: expensive OpenRouter call
  roadmap: {
    limit: 4,
    windowMs: 60 * 1000,       // 4 req / min per IP
    label: "Roadmap Generator",
  },
  // Default: reasonable catch-all for any unlisted route
  default: {
    limit: 30,
    windowMs: 60 * 1000,       // 30 req / min per IP
    label: "API",
  },
};

// ─── Sliding Window Store ─────────────────────────────────────────────────────

interface WindowEntry {
  timestamps: number[];   // sorted array of request timestamps (ms)
  lastCleaned: number;    // last time old entries were purged
}

// Global map: `${routeKey}:${ip}` → WindowEntry
const store = new Map<string, WindowEntry>();

// Cleanup entries older than 10 minutes every GC_INTERVAL ms
const GC_INTERVAL_MS = 5 * 60 * 1000;
let lastGC = Date.now();

function runGC() {
  const now = Date.now();
  if (now - lastGC < GC_INTERVAL_MS) return;
  lastGC = now;
  const cutoff = now - 10 * 60 * 1000; // 10 minutes
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

// ─── Core Check Function ──────────────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
  routeLabel: string;
  limit: number;
}

/**
 * Check if the request is within the rate limit for a given route key.
 * @param ip       - Client IP address
 * @param routeKey - One of the keys in RATE_LIMIT_CONFIGS (or "default")
 */
export function checkRateLimit(ip: string, routeKey: string): RateLimitResult {
  runGC();

  const config =
    RATE_LIMIT_CONFIGS[routeKey] ?? RATE_LIMIT_CONFIGS["default"];
  const { limit, windowMs, label } = config;
  const now = Date.now();
  const storeKey = `${routeKey}:${ip}`;

  let entry = store.get(storeKey);
  if (!entry) {
    entry = { timestamps: [], lastCleaned: now };
    store.set(storeKey, entry);
  }

  // Evict timestamps outside current window
  const windowStart = now - windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  const count = entry.timestamps.length;

  if (count >= limit) {
    const oldestInWindow = entry.timestamps[0]; // earliest timestamp in window
    const resetInMs = windowMs - (now - oldestInWindow);
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(resetInMs, 0),
      routeLabel: label,
      limit,
    };
  }

  // Stamp this request
  entry.timestamps.push(now);

  return {
    allowed: true,
    remaining: limit - entry.timestamps.length,
    resetInMs: windowMs,
    routeLabel: label,
    limit,
  };
}

// ─── IP Extraction ────────────────────────────────────────────────────────────

/**
 * Extracts a reliable client IP from the Next.js request.
 * Checks headers set by common reverse proxies/CDNs before falling back.
 */
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("cf-connecting-ip") ??  // Cloudflare
    "127.0.0.1"
  );
}

// ─── Route Key Resolver ───────────────────────────────────────────────────────

/**
 * Resolves a URL pathname to a route key defined in RATE_LIMIT_CONFIGS.
 * e.g. "/api/market-intelligence" → "market-intelligence"
 */
export function resolveRouteKey(pathname: string): string {
  // Strip leading /api/
  const stripped = pathname.replace(/^\/api\//, "");
  // Match longest prefix config key
  for (const key of Object.keys(RATE_LIMIT_CONFIGS).sort(
    (a, b) => b.length - a.length
  )) {
    if (stripped.startsWith(key)) return key;
  }
  return "default";
}

// ─── Response Helper ──────────────────────────────────────────────────────────

/**
 * Builds a standardized 429 Too Many Requests response.
 */
export function rateLimitResponse(result: RateLimitResult): NextResponse {
  const resetSec = Math.ceil(result.resetInMs / 1000);
  return NextResponse.json(
    {
      error: `Rate limit exceeded for ${result.routeLabel}.`,
      limit: result.limit,
      remaining: 0,
      resetInSeconds: resetSec,
      message: `You have reached the maximum number of requests. Please wait ${resetSec} second(s) before trying again.`,
    },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil((Date.now() + result.resetInMs) / 1000)),
        "Retry-After": String(resetSec),
      },
    }
  );
}

// ─── Convenience Wrapper ──────────────────────────────────────────────────────

/**
 * One-liner to check rate limit inside a route handler.
 *
 * @example
 *   const limited = applyRateLimit(req, "chat");
 *   if (limited) return limited;
 */
export function applyRateLimit(
  req: NextRequest,
  routeKey: string
): NextResponse | null {
  const ip = getClientIp(req);
  const result = checkRateLimit(ip, routeKey);
  if (!result.allowed) {
    console.warn(
      `[RateLimit] BLOCKED — Route: ${routeKey}, IP: ${ip}, Limit: ${result.limit}/min`
    );
    return rateLimitResponse(result);
  }
  return null;
}
