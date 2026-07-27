"use server";

import { adminAction, orderSchema, type ActionResult } from "@/lib/actions";
import { db } from "@/lib/db";
import { revalidatePublicSite } from "@/lib/revalidate";
import { skillTierSchema, type SkillTierInput } from "@/lib/validation/skills";

export async function saveSkillTier(input: SkillTierInput): Promise<ActionResult> {
  return adminAction(async () => {
    const data = skillTierSchema.parse(input);
    const items = data.items.map((name, index) => ({ name, sortOrder: index }));

    if (data.id) {
      // Replacing the item rows wholesale keeps their order exactly as typed.
      await db.$transaction([
        db.skillTier.update({
          where: { id: data.id },
          data: { name: data.name, subtitle: data.subtitle, level: data.level },
        }),
        db.skillItem.deleteMany({ where: { tierId: data.id } }),
        db.skillItem.createMany({ data: items.map((i) => ({ ...i, tierId: data.id as string })) }),
      ]);
    } else {
      const last = await db.skillTier.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
      await db.skillTier.create({
        data: {
          name: data.name,
          subtitle: data.subtitle,
          level: data.level,
          sortOrder: (last?.sortOrder ?? -1) + 1,
          items: { create: items },
        },
      });
    }
    revalidatePublicSite();
  });
}

export async function deleteSkillTier(id: string): Promise<ActionResult> {
  return adminAction(async () => {
    await db.skillTier.delete({ where: { id } });
    revalidatePublicSite();
  });
}

export async function reorderSkillTiers(ids: string[]): Promise<ActionResult> {
  return adminAction(async () => {
    const parsed = orderSchema.parse({ ids });
    await db.$transaction(
      parsed.ids.map((id, index) => db.skillTier.update({ where: { id }, data: { sortOrder: index } })),
    );
    revalidatePublicSite();
  });
}
