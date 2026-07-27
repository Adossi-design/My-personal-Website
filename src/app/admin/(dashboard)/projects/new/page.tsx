import { EMPTY_PROJECT, ProjectForm } from "@/components/admin/ProjectForm";
import { countFeatured } from "@/lib/queries/admin-projects";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const [featuredCount, last] = await Promise.all([
    countFeatured(),
    db.project.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } }),
  ]);

  return (
    <ProjectForm
      initial={{ ...EMPTY_PROJECT, sortOrder: (last?.sortOrder ?? -1) + 1 }}
      featuredCount={featuredCount}
    />
  );
}
