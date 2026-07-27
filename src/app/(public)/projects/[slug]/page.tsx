import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/public/Markdown";
import { DetailMedia } from "@/components/public/ProjectMedia";
import { Reveal } from "@/components/public/Reveal";
import {
  CATEGORY_LABELS,
  getNeighbours,
  getProjectBySlug,
  getPublishedSlugs,
  readMetrics,
} from "@/lib/queries/projects";
import { getSettings } from "@/lib/queries/site";
import { siteUrl } from "@/lib/env";

export const revalidate = 3600;

export async function generateStaticParams() {
  const rows = await getPublishedSlugs();
  return rows.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSettings()]);
  if (!project) return { title: "Project not found" };

  const url = `${siteUrl()}/projects/${project.slug}`;
  const image = project.mediaType === "IMAGE" && project.mediaUrl ? project.mediaUrl : project.posterUrl ?? settings.ogImageUrl;

  return {
    title: `${project.title} | ${settings.name}`,
    description: project.shortDescription,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      url,
      type: "article",
      images: image ? [{ url: image, alt: project.mediaAlt || project.title }] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [neighbours, settings] = await Promise.all([getNeighbours(project), getSettings()]);
  const metrics = readMetrics(project.metrics);

  return (
    <main id="top">
      <section className="detail-head">
        <div className="wrap">
          <Link className="back-link" href="/projects">
            {"←"} All projects
          </Link>
          <p className="eyebrow">{project.domain}</p>
          <h1 className="detail-title">{project.title}</h1>
        </div>
      </section>

      <div className="wrap">
        <DetailMedia project={project} />

        <div className="detail-grid">
          <div>
            {metrics.length > 0 && (
              <div className="metrics">
                {metrics.map((metric) => (
                  <div className="metric" key={metric.label}>
                    <b>{metric.value}</b>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            )}

            <Markdown>{project.fullDescription}</Markdown>
          </div>

          <aside>
            {project.techStack.length > 0 && (
              <div className="side-card">
                <p className="side-label">Tech stack</p>
                <div className="tags">
                  {project.techStack.map((tech) => (
                    <span className="tag" key={tech}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(project.repoUrl || project.liveUrl) && (
              <div className="side-card">
                <p className="side-label">Links</p>
                <div className="side-actions">
                  {project.repoUrl && (
                    <a className="btn btn--ghost" href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      Source
                    </a>
                  )}
                  {project.liveUrl && (
                    <a className="btn btn--primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      Live demo
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="side-card">
              <p className="side-label">Category</p>
              <span className="tag">{CATEGORY_LABELS[project.category]}</span>
            </div>
          </aside>
        </div>

        <Reveal>
          <nav className="detail-nav" aria-label="Project navigation">
            {neighbours.previous ? (
              <Link href={`/projects/${neighbours.previous.slug}`}>
                <small>Previous</small>
                <strong>{neighbours.previous.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {neighbours.next ? (
              <Link className="next" href={`/projects/${neighbours.next.slug}`}>
                <small>Next</small>
                <strong>{neighbours.next.title}</strong>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </Reveal>

        <div className="center-row" style={{ marginBottom: 40 }}>
          <a className="btn btn--ghost" href={`mailto:${settings.email}`}>
            Talk to me about this project
          </a>
        </div>
      </div>
    </main>
  );
}
