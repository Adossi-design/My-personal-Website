"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { buttonClass, Card, Field, inputClass, primaryButtonClass } from "@/components/admin/ui";
import type { SettingsInput } from "@/lib/validation/settings";
import { saveSettings } from "./actions";

export function SettingsForm({ initial, blobReady }: { initial: SettingsInput; blobReady: boolean }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof SettingsInput>(key: K, value: SettingsInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function save() {
    setErrors({});
    startTransition(async () => {
      const result = await saveSettings(values);
      if (!result.ok) {
        if (result.fields) setErrors(result.fields);
        toast.error(result.error);
        return;
      }
      setDirty(false);
      toast.success("Settings saved");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          {dirty && <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">Unsaved changes</p>}
        </div>
        <button type="button" className={`${primaryButtonClass} ml-auto`} onClick={save} disabled={pending || !dirty}>
          {pending ? "Saving" : "Save"}
        </button>
      </div>

      {!blobReady && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          Blob storage is not configured, so uploads are disabled. Set BLOB_READ_WRITE_TOKEN to enable them.
        </p>
      )}

      <Card title="Identity">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required error={errors.name?.[0]}>
            <input type="text" value={values.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Role title" required error={errors.roleTitle?.[0]}>
            <input
              type="text"
              value={values.roleTitle}
              onChange={(e) => set("roleTitle", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <Card title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" required error={errors.email?.[0]}>
            <input type="email" value={values.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Phone" required error={errors.phone?.[0]}>
            <input type="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Location" required error={errors.location?.[0]}>
            <input
              type="text"
              value={values.location}
              onChange={(e) => set("location", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="GitHub URL" required error={errors.githubUrl?.[0]}>
            <input
              type="url"
              value={values.githubUrl}
              onChange={(e) => set("githubUrl", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="LinkedIn URL" required error={errors.linkedinUrl?.[0]}>
            <input
              type="url"
              value={values.linkedinUrl}
              onChange={(e) => set("linkedinUrl", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <Card title="Availability" description="Controls the pulsing pill at the top of the hero.">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.availabilityOn}
              onChange={(e) => set("availabilityOn", e.target.checked)}
              className="size-4"
            />
            Show the availability pill
          </label>
          <Field label="Availability text" error={errors.availabilityText?.[0]}>
            <input
              type="text"
              value={values.availabilityText}
              onChange={(e) => set("availabilityText", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <Card title="Hero photo" description="The portrait behind the hero text.">
        <div className="space-y-3">
          {blobReady ? (
            <MediaUploader
              kind="image"
              label="a portrait"
              value={values.heroPhotoUrl}
              onChange={(url) => set("heroPhotoUrl", url)}
            />
          ) : null}
          <Field label="Or a path" hint="Defaults to /assets/profile.jpg" error={errors.heroPhotoUrl?.[0]}>
            <input
              type="text"
              value={values.heroPhotoUrl ?? ""}
              onChange={(e) => set("heroPhotoUrl", e.target.value || null)}
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <Card title="Résumé PDF">
        <div className="space-y-3">
          {blobReady ? (
            <MediaUploader
              kind="pdf"
              label="your résumé"
              value={values.resumePdfUrl}
              onChange={(url) => set("resumePdfUrl", url)}
            />
          ) : null}
          <Field label="Or a URL" error={errors.resumePdfUrl?.[0]}>
            <input
              type="text"
              value={values.resumePdfUrl ?? ""}
              onChange={(e) => set("resumePdfUrl", e.target.value || null)}
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <Card title="SEO" description="Used for the page title, description and social preview.">
        <div className="space-y-4">
          <Field label="Meta title" required error={errors.metaTitle?.[0]}>
            <input
              type="text"
              value={values.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field
            label="Meta description"
            required
            hint={`${values.metaDescription.length} characters, around 155 reads best`}
            error={errors.metaDescription?.[0]}
          >
            <textarea
              rows={3}
              value={values.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
              className={inputClass}
            />
          </Field>
          {blobReady && (
            <Field label="Social preview image">
              <MediaUploader
                kind="image"
                label="an OpenGraph image, 1200 by 630"
                value={values.ogImageUrl}
                onChange={(url) => set("ogImageUrl", url)}
              />
            </Field>
          )}
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <button type="button" className={buttonClass} onClick={() => { setValues(initial); setDirty(false); }} disabled={pending || !dirty}>
          Discard changes
        </button>
        <button type="button" className={primaryButtonClass} onClick={save} disabled={pending || !dirty}>
          Save
        </button>
      </div>
    </div>
  );
}
