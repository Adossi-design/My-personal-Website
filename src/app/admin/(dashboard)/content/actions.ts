"use server";

import { adminAction, type ActionResult } from "@/lib/actions";
import { db } from "@/lib/db";
import { revalidatePublicSite } from "@/lib/revalidate";
import { contentResetSchema, contentUpdateSchema } from "@/lib/validation/content";

export async function saveContentBlocks(updates: { id: string; value: string }[]): Promise<ActionResult> {
  return adminAction(async () => {
    const parsed = contentUpdateSchema.parse({ updates });
    await db.$transaction(
      parsed.updates.map((u) => db.contentBlock.update({ where: { id: u.id }, data: { value: u.value } })),
    );
    revalidatePublicSite();
  });
}

export async function resetContentBlock(id: string): Promise<ActionResult> {
  return adminAction(async () => {
    const parsed = contentResetSchema.parse({ id });
    const block = await db.contentBlock.findUnique({ where: { id: parsed.id } });
    if (!block) throw new Error("Block not found");
    await db.contentBlock.update({ where: { id: parsed.id }, data: { value: block.defaultValue } });
    revalidatePublicSite();
  });
}
