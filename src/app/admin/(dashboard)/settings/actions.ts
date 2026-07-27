"use server";

import { adminAction, type ActionResult } from "@/lib/actions";
import { db } from "@/lib/db";
import { revalidatePublicSite } from "@/lib/revalidate";
import { settingsSchema, type SettingsInput } from "@/lib/validation/settings";

export async function saveSettings(input: SettingsInput): Promise<ActionResult> {
  return adminAction(async () => {
    const data = settingsSchema.parse(input);
    await db.siteSettings.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });
    revalidatePublicSite();
  });
}
