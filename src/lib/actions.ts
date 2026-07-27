import { z } from "zod";
import { requireAdmin, UnauthorizedError } from "./guard";

export type ActionResult = { ok: true } | { ok: false; error: string; fields?: Record<string, string[]> };

// Every server action goes through here, so authorisation and error shaping are
// never left to the individual action to remember.
export async function adminAction(work: () => Promise<void>): Promise<ActionResult> {
  try {
    await requireAdmin();
    await work();
    return { ok: true };
  } catch (error) {
    if (error instanceof UnauthorizedError) return { ok: false, error: "Your session expired. Sign in again." };
    if (error instanceof z.ZodError) {
      const raw = error.flatten().fieldErrors;
      const fields: Record<string, string[]> = {};
      for (const [key, messages] of Object.entries(raw)) {
        if (messages) fields[key] = messages;
      }
      return { ok: false, error: "Check the highlighted fields", fields };
    }
    if (error instanceof Error && error.name === "ApiError") return { ok: false, error: error.message };
    console.error("[action]", error);
    return { ok: false, error: "Something went wrong" };
  }
}

// Reorder payloads all look the same, so one schema covers every sortable list.
export const orderSchema = z.object({ ids: z.array(z.string().cuid()).min(1).max(300) });
