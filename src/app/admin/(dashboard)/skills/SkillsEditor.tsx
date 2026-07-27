"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { SkillItem, SkillTier } from "@prisma/client";
import { TagInput } from "@/components/admin/editors";
import { SortableList } from "@/components/admin/SortableList";
import { buttonClass, Card, dangerButtonClass, Field, inputClass, primaryButtonClass } from "@/components/admin/ui";
import type { SkillTierInput } from "@/lib/validation/skills";
import { deleteSkillTier, reorderSkillTiers, saveSkillTier } from "./actions";

type TierWithItems = SkillTier & { items: SkillItem[] };

const BLANK: SkillTierInput = { name: "", subtitle: "", level: 10, items: [] };

export function SkillsEditor({ initial }: { initial: TierWithItems[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<SkillTierInput | null>(null);
  const [pending, startTransition] = useTransition();

  function reorder(ids: string[]) {
    setRows((current) => ids.map((id) => current.find((r) => r.id === id)!).filter(Boolean));
    startTransition(async () => {
      const result = await reorderSkillTiers(ids);
      if (!result.ok) {
        toast.error(result.error);
        setRows(initial);
        return;
      }
      toast.success("Order saved");
      router.refresh();
    });
  }

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const result = await saveSkillTier(editing);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Saved");
      setEditing(null);
      router.refresh();
    });
  }

  function remove(id: string, name: string) {
    if (!window.confirm(`Delete the "${name}" tier and all its skills?`)) return;
    startTransition(async () => {
      const result = await deleteSkillTier(id);
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
          <h1 className="text-xl font-semibold">Skills</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Level is how many of the ten bar segments fill on the public site.
          </p>
        </div>
        <button type="button" className={`${primaryButtonClass} ml-auto`} onClick={() => setEditing({ ...BLANK })}>
          Add a tier
        </button>
      </div>

      {editing && (
        <Card title={editing.id ? "Edit tier" : "New tier"}>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_110px]">
              <Field label="Name" htmlFor="tierName" required>
                <input
                  id="tierName"
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Subtitle" htmlFor="subtitle" hint="Shown in mono beside the name">
                <input
                  id="subtitle"
                  type="text"
                  value={editing.subtitle}
                  onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Level" htmlFor="level" required hint="0 to 10">
                <input
                  id="level"
                  type="number"
                  min={0}
                  max={10}
                  value={editing.level}
                  onChange={(e) => setEditing({ ...editing, level: Number(e.target.value) })}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Skills" hint="Order here is the order shown on the site">
              <TagInput
                value={editing.items}
                onChange={(items) => setEditing({ ...editing, items })}
                placeholder="Add a skill and press Enter"
              />
            </Field>

            <div className="flex gap-2">
              <button type="button" className={primaryButtonClass} onClick={save} disabled={pending}>
                {pending ? "Saving" : "Save"}
              </button>
              <button type="button" className={buttonClass} onClick={() => setEditing(null)} disabled={pending}>
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}

      <SortableList items={rows} onReorder={reorder}>
        {(row) => (
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-sm font-semibold">{row.name}</p>
              <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.subtitle}</p>
              <p className="ml-auto text-xs text-slate-400">
                {row.items.length} skills, level {row.level} of 10
              </p>
            </div>

            <div className="mt-2 flex gap-1" aria-hidden="true">
              {Array.from({ length: 10 }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded ${
                    i < row.level ? "bg-sky-500" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />
              ))}
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {row.items.slice(0, 12).map((item) => (
                <span key={item.id} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-800">
                  {item.name}
                </span>
              ))}
              {row.items.length > 12 && (
                <span className="px-1.5 py-0.5 text-[11px] text-slate-400">
                  and {row.items.length - 12} more
                </span>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className={buttonClass}
                onClick={() =>
                  setEditing({
                    id: row.id,
                    name: row.name,
                    subtitle: row.subtitle,
                    level: row.level,
                    items: row.items.map((i) => i.name),
                  })
                }
              >
                Edit
              </button>
              <button type="button" className={dangerButtonClass} onClick={() => remove(row.id, row.name)}>
                Delete
              </button>
            </div>
          </div>
        )}
      </SortableList>
    </div>
  );
}
