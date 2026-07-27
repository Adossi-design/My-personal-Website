// Falls back to the Vercel-provided origin so preview deployments get correct absolute URLs.
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

// A non-empty variable is not enough: the .env.example placeholder is non-empty too,
// and treating it as configured makes the admin promise uploads that cannot work.
const BLOB_TOKEN_SHAPE = /^vercel_blob_rw_[A-Za-z0-9_-]{20,}$/;

export function isBlobConfigured(): boolean {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return false;
  if (token.includes("xxxx")) return false;
  return BLOB_TOKEN_SHAPE.test(token);
}
