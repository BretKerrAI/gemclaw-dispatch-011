import { kv } from "@vercel/kv";

const WINDOW_SECONDS = 60 * 60; // one hour
const MAX_PER_WINDOW = 5;

export type RateResult =
  | { allowed: true; remaining: number; resetAt: number }
  | { allowed: false; remaining: 0; resetAt: number };

/**
 * Fixed-window counter keyed by IP. First hit in a window sets a 3600s TTL;
 * subsequent hits increment the same key until the TTL expires. 5 per hour.
 *
 * Fixed-window (not sliding) is fine here — the worst case burst is ~10 in
 * two minutes around the window boundary, still a long way from abuse.
 */
export async function checkRateLimit(ip: string): Promise<RateResult> {
  const key = `rl:gen:${ip}`;
  const count = await kv.incr(key);
  if (count === 1) {
    await kv.expire(key, WINDOW_SECONDS);
  }
  const ttl = await kv.ttl(key);
  const resetAt = Date.now() + Math.max(ttl, 0) * 1000;

  if (count > MAX_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetAt };
  }
  return {
    allowed: true,
    remaining: Math.max(0, MAX_PER_WINDOW - count),
    resetAt,
  };
}

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "anon";
}
