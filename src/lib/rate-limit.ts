import { db } from "./db";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

export type RateLimitResult = { allowed: boolean; retryAfterMinutes: number; remaining: number };

// Counts failures in Postgres rather than memory, because serverless instances share neither.
export async function checkLoginRateLimit(ip: string): Promise<RateLimitResult> {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

  const failures = await db.loginAttempt.findMany({
    where: { ip, success: false, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });

  if (failures.length < MAX_ATTEMPTS) {
    return { allowed: true, retryAfterMinutes: 0, remaining: MAX_ATTEMPTS - failures.length };
  }

  const oldest = failures[0].createdAt.getTime();
  const unlocksAt = oldest + WINDOW_MINUTES * 60 * 1000;
  const retryAfterMinutes = Math.max(1, Math.ceil((unlocksAt - Date.now()) / 60000));
  return { allowed: false, retryAfterMinutes, remaining: 0 };
}

export async function recordLoginAttempt(ip: string, email: string, success: boolean) {
  await db.loginAttempt.create({ data: { ip, email: email.slice(0, 200), success } });
  // A success clears the counter so a legitimate user is not locked out by earlier typos.
  if (success) {
    await db.loginAttempt.deleteMany({ where: { ip, success: false } });
  }
}

// Trims rows that can no longer affect any window, keeping the table from growing without bound.
export async function pruneLoginAttempts() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await db.loginAttempt.deleteMany({ where: { createdAt: { lt: cutoff } } });
}

// Vercel sets x-forwarded-for; the left-most entry is the client.
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}
