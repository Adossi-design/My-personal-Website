import type { Metadata } from "next";
import { Reveal } from "@/components/public/Reveal";
import { CourseworkCard } from "@/components/public/Sections";
import { getCopy } from "@/lib/queries/content";
import { CATEGORY_ORDER, FILTER_LABELS, getCategoryCounts, getPublishedProjects } from "@/lib/queries/projects";
import { getCoursework, getSettings } from "@/lib/queries/site";
import { siteUrl } from "@/lib/env";
import { REPO_BASE } from "@/config/site";
import { ProjectFilters, type FilterChip, type IndexProject } from "./ProjectFilters";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [copy, settings] = await Promise.all([getCopy(), getSettings()]);
  const title = `${copy("projects.index.title")} | ${settings.name}`;
  return {
    title,
    description: copy("projects.index.subtitle"),
    alternates: { canonical: `${siteUrl()}/projects` },
    openGraph: { title, description: copy("projects.index.subtitle"), url: `${siteUrl()}/projects` },
  };
}

export default async function ProjectsIndexPage() {
  const [copy, projects, counts, coursework] = await Promise.all([
    getCopy(),
    getPublishedProjects(),
    getCategoryCounts(),
    getCoursework(),
  ]);

  const chips: FilterChip[] = [
    { value: "all", label: "All", count: projects.length },
    ...CATEGORY_ORDER.filter((category) => (counts.get(category) ?? 0) > 0).map((category) => ({
      value: category,
      label: FILTER_LABELS[category],
      count: counts.get(category) ?? 0,
    })),
  ];

  const cards: IndexProject[] = projects.map((p) => ({
    id: p.id,
    category: p.category,
    slug: p.slug,
    title: p.title,
    domain: p.domain,
    shortDescription: p.shortDescription,
    techStack: p.techStack,
    repoUrl: p.repoUrl,
    liveUrl: p.liveUrl,
    mediaType: p.mediaType,
    mediaUrl: p.mediaUrl,
    posterUrl: p.posterUrl,
    mediaAlt: p.mediaAlt,
    iconKey: p.iconKey,
    featured: p.featured,
  }));

  return (
    <main id="top">
      <section className="journey-section" data-tone="projects" style={{ paddingTop: "calc(var(--nav-h) + 48px)" }}>
        <Reveal className="wrap">
          <p className="eyebrow">{copy("projects.eyebrow")}</p>
          <h2 className="section-title">{copy("projects.index.title")}</h2>
          <p className="section-sub">{copy("projects.index.subtitle")}</p>

          {projects.length > 0 ? (
            <ProjectFilters chips={chips} projects={cards} />
          ) : (
            <p className="empty-note">No projects are published yet.</p>
          )}

          <CourseworkCard copy={copy} coursework={coursework} repoBase={REPO_BASE} />
        </Reveal>
      </section>
    </main>
  );
}
