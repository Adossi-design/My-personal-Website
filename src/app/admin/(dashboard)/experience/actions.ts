"use server";

import { adminAction, orderSchema, type ActionResult } from "@/lib/actions";
import { db } from "@/lib/db";
import { revalidatePublicSite } from "@/lib/revalidate";
import { experienceSchema, type ExperienceInput } from "@/lib/validation/cv";

export async function saveExperience(input: ExperienceInput): Promise<ActionResult> {
  return adminAction(async () => {
    const data = experienceSchema.parse(input);
    if (data.id) {
      await db.experience.update({ where: { id: data.id }, data: { ...data, id: undefined } });
    } else {
      const last = await db.experience.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
      await db.experience.create({ data: { ...data, id: undefined, sortOrder: (last?.sortOrder ?? -1) + 1 } });
    }
    revalidatePublicSite();
  });
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  return adminAction(async () => {
    await db.experience.delete({ where: { id } });
    revalidatePublicSite();
  });
}

export async function reorderExperience(ids: string[]): Promise<ActionResult> {
  return adminAction(async () => {
    const parsed = orderSchema.parse({ ids });
    await db.$transaction(
      parsed.ids.map((id, index) => db.experience.update({ where: { id }, data: { sortOrder: index } })),
    );
    revalidatePublicSite();
  });
}
