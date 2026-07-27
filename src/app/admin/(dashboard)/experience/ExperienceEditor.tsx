"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Experience } from "@prisma/client";
import { BulletsEditor } from "@/components/admin/BulletsEditor";
import { SortableList } from "@/components/admin/SortableList";
import { buttonClass, dangerButtonClass, Field, inputClass, primaryButtonClass } from "@/components/admin/ui";
import { deleteExperience, reorderExperience, saveExperience } from "./actions";
import type { ExperienceInput } from "@/lib/validation/cv";

const BLANK: ExperienceInput = { role: "", organisation: "", period: "", location: "", bullets: [""] };

export function ExperienceEditor({ initial }: { initial: Experience[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<ExperienceInput | null>(null);
  const [pending, startTransition] = useTransition();

  function reorder(ids: string[]) {
    setRows((current) => ids.map((id) => current.find((r) => r.id === id)!).filter(Boolean));
    startTransition(async () => {
      const result = await reorderExperience(ids);
      if (!result.ok) {
        toast.error(result.error);
        setRows(initial);
        return;
      }
      toast.success("Order saved");
      router.refresh();
    });
  }

  function save(input: ExperienceInput) {
    startTransition(async () => {
      const cleaned = { ...input, bullets: input.bullets.filter((b) => b.trim().length > 0) };
      const result = await saveExperience(cleaned);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Saved");
      setEditing(null);
      router.refresh();
    });
  }

  function remove(id: string, role: string) {
    if (!window.confirm(`Delete "${role}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deleteExperience(id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Deleted");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold">Experience</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Drag to reorder the timeline.</p>
        </div>
        <button type="button" className={`${primaryButtonClass} ml-auto`} onClick={() => setEditing({ ...BLANK })}>
          Add a role
        </button>
      </div>

      {editing && (
        <ExperienceForm
          value={editing}
          pending={pending}
          onChange={setEditing}
          onCancel={() => setEditing(null)}
          onSave={() => save(editing)}
        />
      )}

      <SortableList items={rows} onReorder={reorder}>
        {(row) => (
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-sm font-semibold">{row.role}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{row.organisation}</p>
              <p className="ml-auto text-xs text-slate-400">
                {row.period}
                {row.location ? ` · ${row.location}` : ""}
              </p>
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-500 dark:text-slate-400">
              {row.bullets.map((bullet, i) => (
                <li key={i} className="line-clamp-2">
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className={buttonClass}
                onClick={() =>
                  setEditing({
                    id: row.id,
                    role: row.role,
                    organisation: row.organisation,
                    period: row.period,
                    location: row.location,
                    bullets: row.bullets.length > 0 ? row.bullets : [""],
                  })
                }
              >
                Edit
              </button>
              <button type="button" className={dangerButtonClass} onClick={() => remove(row.id, row.role)}>
                Delete
              </button>
            </div>
          </div>
        )}
      </SortableList>
    </div>
  );
}

function ExperienceForm({
  value,
  pending,
  onChange,
  onCancel,
  onSave,
}: {
  value: ExperienceInput;
  pending: boolean;
  onChange: (next: ExperienceInput) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <section className="rounded-xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
      <h2 className="text-sm font-semibold">{value.id ? "Edit role" : "New role"}</h2>
      <div className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Role" htmlFor="role" required>
            <input
              id="role"
              type="text"
              value={value.role}
              onChange={(e) => onChange({ ...value, role: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Organisation" htmlFor="organisation" required>
            <input
              id="organisation"
              type="text"
              value={value.organisation}
              onChange={(e) => onChange({ ...value, organisation: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Period" htmlFor="period" required hint="For example, 2025 or 2019 to 2023">
            <input
              id="period"
              type="text"
              value={value.period}
              onChange={(e) => onChange({ ...value, period: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Location" htmlFor="location" hint="Optional">
            <input
              id="location"
              type="text"
              value={value.location}
              onChange={(e) => onChange({ ...value, location: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Bullets">
          <BulletsEditor value={value.bullets} onChange={(bullets) => onChange({ ...value, bullets })} />
        </Field>

        <div className="flex gap-2">
          <button type="button" className={primaryButtonClass} onClick={onSave} disabled={pending}>
            {pending ? "Saving" : "Save"}
          </button>
          <button type="button" className={buttonClass} onClick={onCancel} disabled={pending}>
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}
