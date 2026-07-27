"use client";

import { useEffect, useState } from "react";
import { ProjectCard, type CardProject } from "@/components/public/ProjectCard";

const PLACEHOLDER: CardProject = {
  slug: "preview",
  title: "Project title",
  domain: "Domain · Sector",
  shortDescription: "The card line appears here, clamped to three lines once it runs long enough to need it.",
  techStack: ["Tech", "Stack"],
  repoUrl: null,
  liveUrl: null,
  mediaType: "NONE",
  mediaUrl: null,
  posterUrl: null,
  mediaAlt: "",
  iconKey: "🧩",
};

// Lives inside the public layout so it inherits the real stylesheet, and takes its
// data by postMessage so the admin never needs a second copy of the card.
export function CardPreviewFrame() {
  const [project, setProject] = useState<CardProject>(PLACEHOLDER);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; project?: CardProject };
      if (data?.type === "card-preview" && data.project) setProject(data.project);
    }
    window.addEventListener("message", onMessage);
    window.parent?.postMessage({ type: "card-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div style={{ padding: 16, maxWidth: 420 }}>
      <div className="grid">
        <ProjectCard project={project} preview />
      </div>
    </div>
  );
}
