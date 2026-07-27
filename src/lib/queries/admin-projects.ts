import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { ApiError } from "@/lib/guard";
import { FEATURED_LIMIT } from "@/lib/queries/projects";
import type { ProjectInput } from "@/lib/validation/project";

export { FEATURED_LIMIT };

export async function countFeatured(excludeId?: string) {
  return db.project.count({ where: { featured: true, ...(excludeId ? { id: { not: excludeId } } : {}) } });
}

// The six-project cap is enforced here, so a crafted request cannot exceed it
// even though the UI also disables the control.
async function assertFeaturedCapacity(excludeId?: string) {
  const current = await countFeatured(excludeId);
  if (current >= FEATURED_LIMIT) {
    throw new ApiError(
      `Only ${FEATURED_LIMIT} projects can be featured. Unfeature one first.`,
      409,
    );
  }
}

// Appends to the end of the featured order rather than colliding with an existing position.
async function nextFeaturedOrder() {
  const last = await db.project.findFirst({
    where: { featured: true },
    orderBy: { featuredOrder: "desc" },
    select: { featuredOrder: true },
  });
  return Math.min(FEATURED_LIMIT, (last?.featuredOrder ?? 0) + 1);
}

export async function setFeatured(id: string, featured: boolean) {
  const existing = await db.project.findUnique({ where: { id }, select: { id: true, featured: true } });
  if (!existing) throw new ApiError("Project not found", 404);
  if (existing.featured === featured) return existing;

  if (featured) {
    await assertFeaturedCapacity(id);
    const featuredOrder = await nextFeaturedOrder();
    return db.project.update({ where: { id }, data: { featured: true, featuredOrder } });
  }

  const updated = await db.project.update({ where: { id }, data: { featured: false, featuredOrder: null } });
  await compactFeaturedOrder();
  return updated;
}

// Closes gaps left by unfeaturing, so positions stay 1..n with no holes.
export async function compactFeaturedOrder() {
  const rows = await db.project.findMany({
    where: { featured: true },
    orderBy: [{ featuredOrder: "asc" }, { updatedAt: "asc" }],
    select: { id: true },
  });
  await db.$transaction(
    rows.map((row, index) =>
      db.project.update({ where: { id: row.id }, data: { featuredOrder: index + 1 } }),
    ),
  );
}

export async function reorderFeatured(ids: string[]) {
  const featured = await db.project.findMany({ where: { featured: true }, select: { id: true } });
  const featuredIds = new Set(featured.map((f) => f.id));
  if (ids.length !== featuredIds.size || ids.some((id) => !featuredIds.has(id))) {
    throw new ApiError("The order must list exactly the currently featured projects", 400);
  }
  await db.$transaction(
    ids.map((id, index) => db.project.update({ where: { id }, data: { featuredOrder: index + 1 } })),
  );
}

async function ensureSlugFree(slug: string, exceptId?: string) {
  const clash = await db.project.findFirst({ where: { slug, ...(exceptId ? { id: { not: exceptId } } : {}) } });
  if (clash) throw new ApiError("Another project already uses that slug", 409, { slug: ["Already in use"] });
}

function toData(input: ProjectInput) {
  return {
    title: input.title,
    slug: input.slug,
    domain: input.domain,
    category: input.category,
    iconKey: input.iconKey,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    mediaType: input.mediaType,
    mediaUrl: input.mediaUrl ?? null,
    posterUrl: input.posterUrl ?? null,
    mediaAlt: input.mediaAlt,
    techStack: input.techStack,
    repoUrl: input.repoUrl ?? null,
    liveUrl: input.liveUrl ?? null,
    metrics: input.metrics as unknown as Prisma.InputJsonValue,
    published: input.published,
    sortOrder: input.sortOrder,
  };
}

export async function createProject(input: ProjectInput) {
  await ensureSlugFree(input.slug);
  if (input.featured) await assertFeaturedCapacity();

  const featuredOrder = input.featured ? await nextFeaturedOrder() : null;
  return db.project.create({ data: { ...toData(input), featured: input.featured, featuredOrder } });
}

export async function updateProject(id: string, input: ProjectInput) {
  const existing = await db.project.findUnique({ where: { id } });
  if (!existing) throw new ApiError("Project not found", 404);
  await ensureSlugFree(input.slug, id);

  const becomingFeatured = input.featured && !existing.featured;
  if (becomingFeatured) await assertFeaturedCapacity(id);

  const featuredOrder = input.featured
    ? becomingFeatured
      ? await nextFeaturedOrder()
      : existing.featuredOrder
    : null;

  const updated = await db.project.update({
    where: { id },
    data: { ...toData(input), featured: input.featured, featuredOrder },
  });
  if (existing.featured && !input.featured) await compactFeaturedOrder();
  return updated;
}

export async function deleteProject(id: string) {
  const existing = await db.project.findUnique({ where: { id }, select: { featured: true } });
  if (!existing) throw new ApiError("Project not found", 404);
  await db.project.delete({ where: { id } });
  if (existing.featured) await compactFeaturedOrder();
}

export async function bulkAction(ids: string[], action: "publish" | "unpublish" | "delete") {
  if (action === "delete") {
    const hadFeatured = await db.project.count({ where: { id: { in: ids }, featured: true } });
    await db.project.deleteMany({ where: { id: { in: ids } } });
    if (hadFeatured > 0) await compactFeaturedOrder();
    return { affected: ids.length };
  }

  const published = action === "publish";
  const result = await db.project.updateMany({ where: { id: { in: ids } }, data: { published } });
  return { affected: result.count };
}

export async function listAdminProjects() {
  return db.project.findMany({
    orderBy: [{ featured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      domain: true,
      category: true,
      iconKey: true,
      published: true,
      featured: true,
      featuredOrder: true,
      sortOrder: true,
      mediaType: true,
      mediaUrl: true,
      posterUrl: true,
      mediaAlt: true,
      updatedAt: true,
    },
  });
}

export type AdminProjectRow = Awaited<ReturnType<typeof listAdminProjects>>[number];
