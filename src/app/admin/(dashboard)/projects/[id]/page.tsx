import { notFound } from "next/navigation";
import { ProjectForm, type ProjectFormValues } from "@/components/admin/ProjectForm";
import { db } from "@/lib/db";
import { countFeatured } from "@/lib/queries/admin-projects";
import { readMetrics } from "@/lib/queries/projects";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, featuredCount] = await Promise.all([
    db.project.findUnique({ where: { id } }),
    countFeatured(id),
  ]);
  if (!project) notFound();

  const initial: ProjectFormValues = {
    title: project.title,
    slug: project.slug,
    domain: project.domain,
    category: project.category,
    iconKey: project.iconKey,
    shortDescription: project.shortDescription,
    fullDescription: project.fullDescription,
    mediaType: project.mediaType,
    mediaUrl: project.mediaUrl,
    posterUrl: project.posterUrl,
    mediaAlt: project.mediaAlt,
    techStack: project.techStack,
    repoUrl: project.repoUrl,
    liveUrl: project.liveUrl,
    metrics: readMetrics(project.metrics),
    featured: project.featured,
    published: project.published,
    sortOrder: project.sortOrder,
  };

  return <ProjectForm initial={initial} projectId={project.id} featuredCount={featuredCount} />;
}
