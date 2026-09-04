import Link from "next/link";
import type { MediaType } from "@prisma/client";
import { CardMedia } from "./ProjectMedia";
import { InteractiveCard } from "./InteractiveCard";

// Deliberately not the Prisma row type: the admin preview renders unsaved form
// state through this same component, so it only needs the display fields.
export type CardProject = {
  slug: string;
  title: string;
  domain: string;
  shortDescription: string;
  techStack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  mediaType: MediaType;
  mediaUrl: string | null;
  posterUrl: string | null;
  mediaAlt: string;
  iconKey: string;
  featured?: boolean;
};

type Props = { project: CardProject; preview?: boolean };

export function ProjectCard({ project, preview = false }: Props) {
  const href = `/projects/${project.slug}`;

  return (
    <InteractiveCard className="card proj">
      <CardMedia project={project} />

      <div className="proj-top">
        <span className="proj-cat">{project.domain}</span>
        <span className="proj-ico" aria-hidden="true">
          {project.iconKey}
        </span>
      </div>

      <h3>{project.title}</h3>
      <p className="proj-desc clamp">{project.shortDescription}</p>

      {project.techStack.length > 0 && (
        <div className="stack">
          {project.techStack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      )}

      <div className="proj-links">
        {preview ? (
          <span className="proj-link">{project.featured ? "Project story" : "Details"}</span>
        ) : (
          <Link className="proj-link" href={href}>
            {project.featured ? "Project story" : "Details"}
          </Link>
        )}
        {project.repoUrl && (
          <a className="proj-link" href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            Code
          </a>
        )}
        {project.liveUrl && (
          <a className="proj-link live" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            Live demo
          </a>
        )}
      </div>
    </InteractiveCard>
  );
}
