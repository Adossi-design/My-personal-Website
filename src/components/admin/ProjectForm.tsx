"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Category, MediaType } from "@prisma/client";
import { FILTER_LABELS } from "@/lib/queries/projects";
import { FEATURED_LIMIT } from "@/config/site";
import { slugify } from "@/lib/slug";
import type { CardProject } from "@/components/public/ProjectCard";
import { CardPreview } from "./CardPreview";
import { MarkdownEditor, MetricsEditor, TagInput, type MetricRow } from "./editors";
import { MediaUploader } from "./MediaUploader";
import { buttonClass, Card, dangerButtonClass, Field, inputClass, primaryButtonClass } from "./ui";

export type ProjectFormValues = {
  title: string;
  slug: string;
  domain: string;
  category: Category;
  iconKey: string;
  shortDescription: string;
  fullDescription: string;
  mediaType: MediaType;
  mediaUrl: string | null;
  posterUrl: string | null;
  mediaAlt: string;
  techStack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  metrics: MetricRow[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export const EMPTY_PROJECT: ProjectFormValues = {
  title: "",
  slug: "",
  domain: "",
  category: Category.ML_AI,
  iconKey: "🧩",
  shortDescription: "",
  fullDescription: "",
  mediaType: MediaType.NONE,
  mediaUrl: null,
  posterUrl: null,
  mediaAlt: "",
  techStack: [],
  repoUrl: null,
  liveUrl: null,
  metrics: [],
  featured: false,
  published: false,
  sortOrder: 0,
};

type Props = { initial: ProjectFormValues; projectId?: string; featuredCount: number };
type Errors = Record<string, string[]>;

const SHORT_LIMIT = 180;

export function ProjectForm({ initial, projectId, featuredCount }: Props) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  // Slug follows the title only until it has been typed in by hand.
  const [slugLocked, setSlugLocked] = useState(Boolean(projectId));

  function set<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  useEffect(() => {
    if (slugLocked) return;
    setValues((current) => ({ ...current, slug: slugify(current.title) }));
  }, [values.title, slugLocked]);

  // Warns before a reload or tab close discards unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const previewProject: CardProject = useMemo(
    () => ({
      slug: values.slug || "preview",
      title: values.title || "Project title",
      domain: values.domain || "Domain · Sector",
      shortDescription: values.shortDescription || "The card line appears here.",
      techStack: values.techStack,
      repoUrl: values.repoUrl,
      liveUrl: values.liveUrl,
      mediaType: values.mediaType,
      mediaUrl: values.mediaUrl,
      posterUrl: values.posterUrl,
      mediaAlt: values.mediaAlt,
      iconKey: values.iconKey || "🧩",
    }),
    [values],
  );

  async function save(published: boolean) {
    setSaving(true);
    setErrors({});

    const payload = { ...values, published };
    const response = await fetch(projectId ? `/api/admin/projects/${projectId}` : "/api/admin/projects", {
      method: projectId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (data.fields) setErrors(data.fields);
      toast.error(data.error ?? "Could not save");
      return;
    }

    setDirty(false);
    toast.success(published ? "Published" : "Saved as a draft");
    router.push("/admin/projects");
    router.refresh();
  }

  async function remove() {
    if (!projectId) return;
    if (!window.confirm(`Delete "${values.title}"? This cannot be undone.`)) return;

    const response = await fetch(`/api/admin/projects/${projectId}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      toast.error(data.error ?? "Could not delete");
      return;
    }
    setDirty(false);
    toast.success("Project deleted");
    router.push("/admin/projects");
    router.refresh();
  }

  const featureBlocked = !initial.featured && featuredCount >= FEATURED_LIMIT;
  const shortLeft = SHORT_LIMIT - values.shortDescription.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold">{projectId ? "Edit project" : "New project"}</h1>
          {dirty && <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">Unsaved changes</p>}
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          {projectId && (
            <button type="button" className={dangerButtonClass} onClick={remove} disabled={saving}>
              Delete
            </button>
          )}
          <button type="button" className={buttonClass} onClick={() => save(false)} disabled={saving}>
            Save as draft
          </button>
          <button type="button" className={primaryButtonClass} onClick={() => save(true)} disabled={saving}>
            {saving ? "Saving" : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card title="Basics">
            <div className="space-y-4">
              <Field label="Title" htmlFor="title" required error={errors.title?.[0]}>
                <input
                  id="title"
                  type="text"
                  value={values.title}
                  onChange={(e) => set("title", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field
                label="Slug"
                htmlFor="slug"
                required
                hint="The URL becomes /projects/your-slug"
                error={errors.slug?.[0]}
              >
                <input
                  id="slug"
                  type="text"
                  value={values.slug}
                  onChange={(e) => {
                    setSlugLocked(true);
                    set("slug", e.target.value);
                  }}
                  className={inputClass}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Domain label" htmlFor="domain" required hint="Shown above the card title" error={errors.domain?.[0]}>
                  <input
                    id="domain"
                    type="text"
                    value={values.domain}
                    placeholder="ML · Agriculture"
                    onChange={(e) => set("domain", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Category" htmlFor="category" required error={errors.category?.[0]}>
                  <select
                    id="category"
                    value={values.category}
                    onChange={(e) => set("category", e.target.value as Category)}
                    className={inputClass}
                  >
                    {Object.values(Category).map((value) => (
                      <option key={value} value={value}>
                        {FILTER_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)]">
                <Field label="Icon" htmlFor="iconKey" required hint="One emoji" error={errors.iconKey?.[0]}>
                  <input
                    id="iconKey"
                    type="text"
                    value={values.iconKey}
                    onChange={(e) => set("iconKey", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Card line"
                  htmlFor="shortDescription"
                  required
                  hint={`Clamped to three lines. ${shortLeft} character${shortLeft === 1 ? "" : "s"} left.`}
                  error={errors.shortDescription?.[0]}
                >
                  <textarea
                    id="shortDescription"
                    value={values.shortDescription}
                    rows={3}
                    maxLength={SHORT_LIMIT}
                    onChange={(e) => set("shortDescription", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          </Card>

          <Card title="Full description" description="Markdown, shown on the project page.">
            <MarkdownEditor value={values.fullDescription} onChange={(v) => set("fullDescription", v)} />
            {errors.fullDescription?.[0] && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.fullDescription[0]}</p>
            )}
          </Card>

          <Card title="Media" description="Sits at the top of the card at a 16:9 ratio.">
            <div className="space-y-4">
              <Field label="Media type" htmlFor="mediaType">
                <select
                  id="mediaType"
                  value={values.mediaType}
                  onChange={(e) => {
                    const next = e.target.value as MediaType;
                    setValues((current) => ({
                      ...current,
                      mediaType: next,
                      // Switching type clears a URL that no longer applies.
                      mediaUrl: next === MediaType.NONE ? null : current.mediaUrl,
                    }));
                    setDirty(true);
                  }}
                  className={inputClass}
                >
                  <option value={MediaType.NONE}>None, use the styled placeholder</option>
                  <option value={MediaType.IMAGE}>Image upload</option>
                  <option value={MediaType.VIDEO}>Video upload</option>
                  <option value={MediaType.VIDEO_EMBED}>YouTube or Vimeo link</option>
                </select>
              </Field>

              {values.mediaType === MediaType.IMAGE && (
                <>
                  <MediaUploader
                    kind="image"
                    label="a JPG, PNG or WebP"
                    value={values.mediaUrl}
                    onChange={(url) => set("mediaUrl", url)}
                  />
                  <Field
                    label="Alt text"
                    htmlFor="mediaAlt"
                    required
                    hint="Describes the image for screen readers"
                    error={errors.mediaAlt?.[0]}
                  >
                    <input
                      id="mediaAlt"
                      type="text"
                      value={values.mediaAlt}
                      onChange={(e) => set("mediaAlt", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </>
              )}

              {values.mediaType === MediaType.VIDEO && (
                <>
                  <MediaUploader
                    kind="video"
                    label="an MP4 or WebM"
                    value={values.mediaUrl}
                    onChange={(url) => set("mediaUrl", url)}
                  />
                  <div>
                    <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Poster frame</p>
                    <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                      Shown to visitors who prefer reduced motion, so the card never moves for them.
                    </p>
                    <MediaUploader
                      kind="image"
                      label="a still frame"
                      value={values.posterUrl}
                      onChange={(url) => set("posterUrl", url)}
                    />
                  </div>
                </>
              )}

              {values.mediaType === MediaType.VIDEO_EMBED && (
                <>
                  <Field label="Video URL" htmlFor="mediaUrl" required error={errors.mediaUrl?.[0]}>
                    <input
                      id="mediaUrl"
                      type="url"
                      value={values.mediaUrl ?? ""}
                      placeholder="https://www.youtube.com/watch?v=..."
                      onChange={(e) => set("mediaUrl", e.target.value || null)}
                      className={inputClass}
                    />
                  </Field>
                  <div>
                    <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                      Optional custom still. Without one, the provider thumbnail is used.
                    </p>
                    <MediaUploader
                      kind="image"
                      label="a still frame"
                      value={values.posterUrl}
                      onChange={(url) => set("posterUrl", url)}
                    />
                  </div>
                </>
              )}

              {errors.mediaUrl?.[0] && values.mediaType !== MediaType.VIDEO_EMBED && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.mediaUrl[0]}</p>
              )}
            </div>
          </Card>

          <Card title="Tech stack">
            <TagInput value={values.techStack} onChange={(v) => set("techStack", v)} />
          </Card>

          <Card title="Metrics" description="Shown as a readout block on the project page.">
            <MetricsEditor value={values.metrics} onChange={(v) => set("metrics", v)} />
          </Card>

          <Card title="Links">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Source repository" htmlFor="repoUrl" error={errors.repoUrl?.[0]}>
                <input
                  id="repoUrl"
                  type="url"
                  value={values.repoUrl ?? ""}
                  onChange={(e) => set("repoUrl", e.target.value || null)}
                  className={inputClass}
                />
              </Field>
              <Field label="Live demo" htmlFor="liveUrl" error={errors.liveUrl?.[0]}>
                <input
                  id="liveUrl"
                  type="url"
                  value={values.liveUrl ?? ""}
                  onChange={(e) => set("liveUrl", e.target.value || null)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <CardPreview project={previewProject} />

          <Card title="Placement">
            <div className="space-y-4">
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={values.featured}
                  disabled={featureBlocked}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="mt-0.5 size-4"
                />
                <span>
                  Feature on the homepage
                  {featureBlocked && (
                    <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                      {FEATURED_LIMIT} are already featured. Unfeature one first.
                    </span>
                  )}
                </span>
              </label>

              <Field label="Sort order" htmlFor="sortOrder" hint="Position in the full index. Lower comes first.">
                <input
                  id="sortOrder"
                  type="number"
                  min={0}
                  value={values.sortOrder}
                  onChange={(e) => set("sortOrder", Number(e.target.value) || 0)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
