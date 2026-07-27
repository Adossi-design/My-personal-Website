"use client";

import { useMemo, useState } from "react";
import type { Category } from "@prisma/client";
import { ProjectCard, type CardProject } from "@/components/public/ProjectCard";

export type FilterChip = { value: Category | "all"; label: string; count: number };
export type IndexProject = CardProject & { id: string; category: Category };

// Filtering stays on the client so switching chips is instant, but every project
// and every count still comes from the database.
export function ProjectFilters({ chips, projects }: { chips: FilterChip[]; projects: IndexProject[] }) {
  const [active, setActive] = useState<Category | "all">("all");

  const visible = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category === active)),
    [active, projects],
  );

  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects by category">
        {chips.map((chip) => (
          <button
            key={chip.value}
            type="button"
            className={active === chip.value ? "filter-btn active" : "filter-btn"}
            aria-pressed={active === chip.value}
            onClick={() => setActive(chip.value)}
          >
            {chip.label} <span className="n">{chip.count}</span>
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="grid cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="empty-note">Nothing published in this category yet.</p>
      )}
    </>
  );
}
