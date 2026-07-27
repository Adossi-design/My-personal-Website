"use server";

import type { Prisma } from "@prisma/client";
import { adminAction, orderSchema, type ActionResult } from "@/lib/actions";
import { db } from "@/lib/db";
import { revalidatePublicSite } from "@/lib/revalidate";
import { certificationSchema, educationSchema, type CertificationInput, type EducationInput } from "@/lib/validation/cv";

export async function saveEducation(input: EducationInput): Promise<ActionResult> {
  return adminAction(async () => {
    const data = educationSchema.parse(input);
    const record = {
      degree: data.degree,
      institution: data.institution,
      period: data.period,
      meta: data.meta,
      note: data.note,
      iconKey: data.iconKey,
      grades: data.grades as unknown as Prisma.InputJsonValue,
    };

    if (data.id) {
      await db.educationItem.update({ where: { id: data.id }, data: record });
    } else {
      const last = await db.educationItem.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
      await db.educationItem.create({ data: { ...record, sortOrder: (last?.sortOrder ?? -1) + 1 } });
    }
    revalidatePublicSite();
  });
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  return adminAction(async () => {
    await db.educationItem.delete({ where: { id } });
    revalidatePublicSite();
  });
}

export async function saveCertification(input: CertificationInput): Promise<ActionResult> {
  return adminAction(async () => {
    const data = certificationSchema.parse(input);
    if (data.id) {
      await db.certification.update({ where: { id: data.id }, data: { ...data, id: undefined } });
    } else {
      const last = await db.certification.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
      await db.certification.create({ data: { ...data, id: undefined, sortOrder: (last?.sortOrder ?? -1) + 1 } });
    }
    revalidatePublicSite();
  });
}

export async function deleteCertification(id: string): Promise<ActionResult> {
  return adminAction(async () => {
    await db.certification.delete({ where: { id } });
    revalidatePublicSite();
  });
}

export async function reorderCertifications(ids: string[]): Promise<ActionResult> {
  return adminAction(async () => {
    const parsed = orderSchema.parse({ ids });
    await db.$transaction(
      parsed.ids.map((id, index) => db.certification.update({ where: { id }, data: { sortOrder: index } })),
    );
    revalidatePublicSite();
  });
}
