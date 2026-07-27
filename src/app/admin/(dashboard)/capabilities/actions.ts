"use server";

import { adminAction, orderSchema, type ActionResult } from "@/lib/actions";
import { db } from "@/lib/db";
import { revalidatePublicSite } from "@/lib/revalidate";
import { capabilitySchema, domainSchema, type CardInput } from "@/lib/validation/skills";
import { courseworkSchema, heroStatSchema, infoListSchema, type CourseworkInput, type HeroStatInput, type InfoListInput } from "@/lib/validation/settings";

export async function saveCapability(input: CardInput): Promise<ActionResult> {
  return adminAction(async () => {
    const data = capabilitySchema.parse(input);
    if (data.id) {
      await db.capability.update({ where: { id: data.id }, data: { ...data, id: undefined } });
    } else {
      const last = await db.capability.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
      await db.capability.create({ data: { ...data, id: undefined, sortOrder: (last?.sortOrder ?? -1) + 1 } });
    }
    revalidatePublicSite();
  });
}

export async function deleteCapability(id: string): Promise<ActionResult> {
  return adminAction(async () => {
    await db.capability.delete({ where: { id } });
    revalidatePublicSite();
  });
}

export async function reorderCapabilities(ids: string[]): Promise<ActionResult> {
  return adminAction(async () => {
    const parsed = orderSchema.parse({ ids });
    await db.$transaction(
      parsed.ids.map((id, index) => db.capability.update({ where: { id }, data: { sortOrder: index } })),
    );
    revalidatePublicSite();
  });
}

export async function saveDomain(input: CardInput): Promise<ActionResult> {
  return adminAction(async () => {
    const data = domainSchema.parse(input);
    if (data.id) {
      await db.domain.update({ where: { id: data.id }, data: { ...data, id: undefined } });
    } else {
      const last = await db.domain.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
      await db.domain.create({ data: { ...data, id: undefined, sortOrder: (last?.sortOrder ?? -1) + 1 } });
    }
    revalidatePublicSite();
  });
}

export async function deleteDomain(id: string): Promise<ActionResult> {
  return adminAction(async () => {
    await db.domain.delete({ where: { id } });
    revalidatePublicSite();
  });
}

export async function reorderDomains(ids: string[]): Promise<ActionResult> {
  return adminAction(async () => {
    const parsed = orderSchema.parse({ ids });
    await db.$transaction(
      parsed.ids.map((id, index) => db.domain.update({ where: { id }, data: { sortOrder: index } })),
    );
    revalidatePublicSite();
  });
}

export async function saveHeroStat(input: HeroStatInput): Promise<ActionResult> {
  return adminAction(async () => {
    const data = heroStatSchema.parse(input);
    if (data.id) {
      await db.heroStat.update({ where: { id: data.id }, data: { ...data, id: undefined } });
    } else {
      const last = await db.heroStat.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
      await db.heroStat.create({ data: { ...data, id: undefined, sortOrder: (last?.sortOrder ?? -1) + 1 } });
    }
    revalidatePublicSite();
  });
}

export async function deleteHeroStat(id: string): Promise<ActionResult> {
  return adminAction(async () => {
    await db.heroStat.delete({ where: { id } });
    revalidatePublicSite();
  });
}

export async function saveCoursework(input: CourseworkInput): Promise<ActionResult> {
  return adminAction(async () => {
    const data = courseworkSchema.parse(input);
    if (data.id) {
      await db.courseworkItem.update({ where: { id: data.id }, data: { ...data, id: undefined } });
    } else {
      const last = await db.courseworkItem.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
      await db.courseworkItem.create({ data: { ...data, id: undefined, sortOrder: (last?.sortOrder ?? -1) + 1 } });
    }
    revalidatePublicSite();
  });
}

export async function deleteCoursework(id: string): Promise<ActionResult> {
  return adminAction(async () => {
    await db.courseworkItem.delete({ where: { id } });
    revalidatePublicSite();
  });
}

export async function saveInfoList(input: InfoListInput): Promise<ActionResult> {
  return adminAction(async () => {
    const data = infoListSchema.parse(input);
    if (data.id) {
      await db.infoList.update({ where: { id: data.id }, data: { ...data, id: undefined } });
    } else {
      const last = await db.infoList.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
      await db.infoList.create({ data: { ...data, id: undefined, sortOrder: (last?.sortOrder ?? -1) + 1 } });
    }
    revalidatePublicSite();
  });
}

export async function deleteInfoList(id: string): Promise<ActionResult> {
  return adminAction(async () => {
    await db.infoList.delete({ where: { id } });
    revalidatePublicSite();
  });
}
