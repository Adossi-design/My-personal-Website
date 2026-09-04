import type { MetadataRoute } from "next";
import { getPublishedSlugs } from "@/lib/queries/projects";
import { siteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const slugs = await getPublishedSlugs();

  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/academic-profile`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/projects`, changeFrequency: "weekly", priority: 0.8 },
    ...slugs.map((row) => ({
      url: `${base}/projects/${row.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
