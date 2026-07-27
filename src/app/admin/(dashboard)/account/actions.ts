"use server";

import bcrypt from "bcryptjs";
import { adminAction, type ActionResult } from "@/lib/actions";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validation/auth";

const BCRYPT_COST = 12;

export async function changePassword(input: ChangePasswordInput): Promise<ActionResult> {
  return adminAction(async () => {
    const session = await requireAdmin();
    const data = changePasswordSchema.parse(input);

    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user) throw new Error("Account not found");

    const matches = await bcrypt.compare(data.currentPassword, user.hashedPassword);
    if (!matches) {
      // Surfaced as a field error so it lands next to the input it concerns.
      const error = new Error("Check the highlighted fields") as Error & { name: string };
      error.name = "ApiError";
      error.message = "Your current password is not correct";
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, BCRYPT_COST);
    await db.user.update({ where: { id: user.id }, data: { hashedPassword } });
  });
}
