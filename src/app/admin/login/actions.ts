"use server";

import { headers } from "next/headers";
import { signIn } from "@/lib/auth";
import { credentialsSchema } from "@/lib/validation/auth";
import { checkLoginRateLimit, clientIp } from "@/lib/rate-limit";

export type LoginState = { error?: string; fields?: Record<string, string[]> };

// A successful signIn reports itself by throwing Next's redirect, identified by this digest.
function isRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

// Enforcement lives in the credentials provider, which every entry point passes
// through. This action only reads the counter, so the form can explain a refusal
// instead of showing a bare "incorrect password".
export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Check the details below", fields: parsed.error.flatten().fieldErrors };
  }
  const { email, password } = parsed.data;

  const ip = clientIp(await headers());
  const before = await checkLoginRateLimit(ip);
  if (!before.allowed) {
    return {
      error: `Too many failed attempts. Try again in ${before.retryAfterMinutes} minute${
        before.retryAfterMinutes === 1 ? "" : "s"
      }.`,
    };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/admin" });
  } catch (error) {
    if (isRedirect(error)) throw error;

    // Re-read after the provider recorded this failure, so the count is accurate.
    const after = await checkLoginRateLimit(ip);
    if (!after.allowed) {
      return {
        error: `Too many failed attempts. Try again in ${after.retryAfterMinutes} minute${
          after.retryAfterMinutes === 1 ? "" : "s"
        }.`,
      };
    }
    return {
      error:
        after.remaining > 0
          ? `Email or password is incorrect. ${after.remaining} attempt${after.remaining === 1 ? "" : "s"} left.`
          : "Email or password is incorrect.",
    };
  }

  return {};
}
