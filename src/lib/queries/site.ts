import { db } from "@/lib/db";
import { siteSettings as defaults } from "@/content/settings";

export type Settings = Awaited<ReturnType<typeof getSettings>>;

// Falls back to the seeded values so a page never crashes on an unseeded database.
export async function getSettings() {
  const row = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  return row ?? { id: "singleton", ...defaults, createdAt: new Date(), updatedAt: new Date() };
}

export async function getHeroStats() {
  return db.heroStat.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getCapabilities() {
  return db.capability.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getDomains() {
  return db.domain.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getSkillTiers() {
  return db.skillTier.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getExperience() {
  return db.experience.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getEducation() {
  return db.educationItem.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getCertifications() {
  return db.certification.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getCoursework() {
  return db.courseworkItem.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getInfoLists() {
  return db.infoList.findMany({ orderBy: { sortOrder: "asc" } });
}

export type GradeRow = { course: string; score: string };

// Education grades are Json, so they are narrowed before the view trusts them.
export function readGrades(value: unknown): GradeRow[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((row) => {
    if (typeof row !== "object" || row === null) return [];
    const { course, score } = row as Record<string, unknown>;
    if (typeof course !== "string" || typeof score !== "string") return [];
    return [{ course, score }];
  });
}
