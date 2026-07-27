import { Category, type Project } from "@prisma/client";
import { db } from "@/lib/db";
import { FEATURED_LIMIT } from "@/config/site";

// Re-exported so existing callers keep one import, but the value is defined in config.
export { FEATURED_LIMIT };

export const CATEGORY_LABELS: Record<Category, string> = {
  ML_AI: "ML and AI",
  MOBILE: "Mobile",
  FULLSTACK: "Full-Stack",
  FOUNDATIONS: "Foundations",
};

// Chip labels keep the wording from the original filter row.
export const FILTER_LABELS: Record<Category, string> = {
  ML_AI: "ML and AI",
  MOBILE: "Mobile",
  FULLSTACK: "Full-Stack and Web",
  FOUNDATIONS: "Foundations",
};

export const CATEGORY_ORDER: Category[] = [
  Category.ML_AI,
  Category.MOBILE,
  Category.FULLSTACK,
  Category.FOUNDATIONS,
];

export type MetricRow = { label: string; value: string };

// metrics is Json, so it is narrowed before any view renders it.
export function readMetrics(value: unknown): MetricRow[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((row) => {
    if (typeof row !== "object" || row === null) return [];
    const { label, value: v } = row as Record<string, unknown>;
    if (typeof label !== "string" || typeof v !== "string") return [];
    return [{ label, value: v }];
  });
}

export async function getFeaturedProjects() {
  return db.project.findMany({
    where: { published: true, featured: true },
    orderBy: [{ featuredOrder: "asc" }, { sortOrder: "asc" }],
    take: FEATURED_LIMIT,
  });
}

export async function getPublishedProjects() {
  return db.project.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

// Counts drive the filter chips, so they always match what is actually published.
export async function getCategoryCounts() {
  const rows = await db.project.groupBy({
    by: ["category"],
    where: { published: true },
    _count: { _all: true },
  });
  const counts = new Map<Category, number>();
  for (const row of rows) counts.set(row.category, row._count._all);
  return counts;
}

export async function getProjectBySlug(slug: string) {
  return db.project.findFirst({ where: { slug, published: true } });
}

export async function getPublishedSlugs() {
  return db.project.findMany({ where: { published: true }, select: { slug: true } });
}

export type Neighbours = { previous: Pick<Project, "slug" | "title"> | null; next: Pick<Project, "slug" | "title"> | null };

// Previous and next follow the same order as the /projects index.
export async function getNeighbours(current: Project): Promise<Neighbours> {
  const ordered = await db.project.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { slug: true, title: true },
  });
  const index = ordered.findIndex((p) => p.slug === current.slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? ordered[index - 1] : null,
    next: index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}
