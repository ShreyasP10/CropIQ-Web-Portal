// src/lib/rate-limit.ts
import { headers } from "next/headers";

type Entry = { count: number; windowStart: number };

const buckets = new Map<string, Entry>();

function sweep(maxEntries = 10_000) {
  if (buckets.size > maxEntries) {
    const now = Date.now();
    for (const [key, entry] of buckets) {
      if (now - entry.windowStart > 60_000) buckets.delete(key);
    }
  }
}

/**
 * In-memory sliding-window rate limiter keyed by client IP.
 * Note: works per server instance; good enough for this site's scale.
 */
export async function checkRateLimit(limit: number, windowMs = 60_000): Promise<boolean> {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const entry = buckets.get(ip);

  if (!entry || now - entry.windowStart >= windowMs) {
    buckets.set(ip, { count: 1, windowStart: now });
    sweep();
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count += 1;
  return true;
}
