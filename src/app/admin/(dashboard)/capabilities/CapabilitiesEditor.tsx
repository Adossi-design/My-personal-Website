"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Capability, CourseworkItem, Domain, HeroStat, InfoList } from "@prisma/client";
import { BulletsEditor } from "@/components/admin/BulletsEditor";
import { SortableList } from "@/components/admin/SortableList";
import { buttonClass, Card, dangerButtonClass, Field, inputClass, primaryButtonClass } from "@/components/admin/ui";
import type { ActionResult } from "@/lib/actions";
import type { CardInput } from "@/lib/validation/skills";
import type { CourseworkInput, HeroStatInput, InfoListInput } from "@/lib/validation/settings";
import {
  deleteCapability,
  deleteCoursework,
  deleteDomain,
  deleteHeroStat,
  deleteInfoList,
  reorderCapabilities,
  reorderDomains,
  saveCapability,
  saveCoursework,
  saveDomain,
  saveHeroStat,
  saveInfoList,
} from "./actions";

type Props = {
  capabilities: Capability[];
  domains: Domain[];
  heroStats: HeroStat[];
  coursework: CourseworkItem[];
  infoLists: InfoList[];
};

export function CapabilitiesEditor(props: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(work: () => Promise<ActionResult>, success: string, after?: () => void) {
    startTransition(async () => {
      const result = await work();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(success);
      after?.();
      router.refresh();
    });
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-semibold">Cards and lists</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          The What I do cards, the domain strip, the hero figures, coursework links and the two bulleted cards.
        </p>
      </div>

      <CardSection
        title="What I do"
        description="Rendered as the three-column grid."
        items={props.capabilities}
        pending={pending}
        onSave={(input, done) => run(() => saveCapability(input), "Saved", done)}
        onDelete={(id) => run(() => deleteCapability(id), "Deleted")}
        onReorder={(ids) => run(() => reorderCapabilities(ids), "Order saved")}
      />

      <CardSection
        title="Domains I have built in"
        description="The four-column strip under About."
        items={props.domains}
        pending={pending}
        onSave={(input, done) => run(() => saveDomain(input), "Saved", done)}
        onDelete={(id) => run(() => deleteDomain(id), "Deleted")}
        onReorder={(ids) => run(() => reorderDomains(ids), "Order saved")}
      />

      <HeroStatsSection
        items={props.heroStats}
        pending={pending}
        onSave={(input, done) => run(() => saveHeroStat(input), "Saved", done)}
        onDelete={(id) => run(() => deleteHeroStat(id), "Deleted")}
      />

      <CourseworkSection
        items={props.coursework}
        pending={pending}
        onSave={(input, done) => run(() => saveCoursework(input), "Saved", done)}
        onDelete={(id) => run(() => deleteCoursework(id), "Deleted")}
      />

      <InfoListSection
        items={props.infoLists}
        pending={pending}
        onSave={(input, done) => run(() => saveInfoList(input), "Saved", done)}
        onDelete={(id) => run(() => deleteInfoList(id), "Deleted")}
      />
    </div>
  );
}

type CardRow = { id: string; title: string; description: string; iconKey: string };

function CardSection({
  title,
  description,
  items,
  pending,
  onSave,
  onDelete,
  onReorder,
}: {
  title: string;
  description: string;
  items: CardRow[];
  pending: boolean;
  onSave: (input: CardInput, done: () => void) => void;
  onDelete: (id: string) => void;
  onReorder: (ids: string[]) => void;
}) {
  const [rows, setRows] = useState(items);
  const [editing, setEditing] = useState<CardInput | null>(null);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <button
          type="button"
          className={`${buttonClass} ml-auto`}
          onClick={() => setEditing({ title: "", description: "", iconKey: "🏗️" })}
        >
          Add
        </button>
      </div>

      {editing && (
        <Card title={editing.id ? "Edit card" : "New card"}>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[80px_minmax(0,1fr)]">
              <Field label="Icon" required>
                <input
                  type="text"
                  value={editing.iconKey}
                  onChange={(e) => setEditing({ ...editing, iconKey: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Title" required>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Description" required>
              <textarea
                rows={4}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className={inputClass}
              />
            </Field>
            <div className="flex gap-2">
              <button
                type="button"
                className={primaryButtonClass}
                disabled={pending}
                onClick={() => onSave(editing, () => setEditing(null))}
              >
                {pending ? "Saving" : "Save"}
              </button>
              <button type="button" className={buttonClass} onClick={() => setEditing(null)} disabled={pending}>
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}

      <SortableList
        items={rows}
        onReorder={(ids) => {
          setRows((current) => ids.map((id) => current.find((r) => r.id === id)!).filter(Boolean));
          onReorder(ids);
        }}
      >
        {(row) => (
          <div>
            <div className="flex items-baseline gap-2">
              <span aria-hidden="true">{row.iconKey}</span>
              <p className="text-sm font-medium">{row.title}</p>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{row.description}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className={buttonClass}
                onClick={() =>
                  setEditing({
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    iconKey: row.iconKey,
                  })
                }
              >
                Edit
              </button>
              <button
                type="button"
                className={dangerButtonClass}
                onClick={() => {
                  if (window.confirm(`Delete "${row.title}"?`)) onDelete(row.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </SortableList>
    </section>
  );
}

function HeroStatsSection({
  items,
  pending,
  onSave,
  onDelete,
}: {
  items: HeroStat[];
  pending: boolean;
  onSave: (input: HeroStatInput, done: () => void) => void;
  onDelete: (id: string) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, HeroStatInput>>(
    () => Object.fromEntries(items.map((s) => [s.id, { id: s.id, value: s.value, label: s.label }])),
  );
  const [adding, setAdding] = useState<HeroStatInput | null>(null);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-semibold">Hero figures</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">The four numbers under the hero buttons.</p>
        </div>
        <button
          type="button"
          className={`${buttonClass} ml-auto`}
          onClick={() => setAdding({ value: "", label: "" })}
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {items.map((stat) => {
          const draft = drafts[stat.id];
          const dirty = draft.value !== stat.value || draft.label !== stat.label;
          return (
            <div key={stat.id} className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <input
                type="text"
                value={draft.value}
                aria-label="Figure"
                onChange={(e) => setDrafts((c) => ({ ...c, [stat.id]: { ...draft, value: e.target.value } }))}
                className={`${inputClass} sm:max-w-24`}
              />
              <input
                type="text"
                value={draft.label}
                aria-label="Label"
                onChange={(e) => setDrafts((c) => ({ ...c, [stat.id]: { ...draft, label: e.target.value } }))}
                className={`${inputClass} sm:max-w-xs`}
              />
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  className={buttonClass}
                  disabled={pending || !dirty}
                  onClick={() => onSave(draft, () => undefined)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className={dangerButtonClass}
                  onClick={() => {
                    if (window.confirm(`Delete "${stat.label}"?`)) onDelete(stat.id);
                  }}
                >
                  {"×"}
                </button>
              </div>
            </div>
          );
        })}

        {adding && (
          <div className="flex flex-wrap gap-2 rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <input
              type="text"
              value={adding.value}
              placeholder="40+"
              aria-label="New figure"
              onChange={(e) => setAdding({ ...adding, value: e.target.value })}
              className={`${inputClass} sm:max-w-24`}
            />
            <input
              type="text"
              value={adding.label}
              placeholder="GitHub repositories"
              aria-label="New label"
              onChange={(e) => setAdding({ ...adding, label: e.target.value })}
              className={`${inputClass} sm:max-w-xs`}
            />
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                className={primaryButtonClass}
                disabled={pending}
                onClick={() => onSave(adding, () => setAdding(null))}
              >
                Add
              </button>
              <button type="button" className={buttonClass} onClick={() => setAdding(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CourseworkSection({
  items,
  pending,
  onSave,
  onDelete,
}: {
  items: CourseworkItem[];
  pending: boolean;
  onSave: (input: CourseworkInput, done: () => void) => void;
  onDelete: (id: string) => void;
}) {
  const [adding, setAdding] = useState<CourseworkInput | null>(null);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-semibold">Coursework links</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The tag strip. Repo name only, the GitHub prefix is added for you.
          </p>
        </div>
        <button type="button" className={`${buttonClass} ml-auto`} onClick={() => setAdding({ name: "", repo: "" })}>
          Add
        </button>
      </div>

      {adding && (
        <div className="flex flex-wrap gap-2 rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
          <input
            type="text"
            value={adding.name}
            placeholder="Display name"
            aria-label="Display name"
            onChange={(e) => setAdding({ ...adding, name: e.target.value })}
            className={`${inputClass} sm:max-w-xs`}
          />
          <input
            type="text"
            value={adding.repo}
            placeholder="repo-name"
            aria-label="Repository name"
            onChange={(e) => setAdding({ ...adding, repo: e.target.value })}
            className={`${inputClass} sm:max-w-xs`}
          />
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              className={primaryButtonClass}
              disabled={pending}
              onClick={() => onSave(adding, () => setAdding(null))}
            >
              Add
            </button>
            <button type="button" className={buttonClass} onClick={() => setAdding(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <span>{item.name}</span>
            <span className="font-mono text-[10px] text-slate-400">{item.repo}</span>
            <button
              type="button"
              aria-label={`Delete ${item.name}`}
              className="text-slate-400 hover:text-red-500"
              onClick={() => {
                if (window.confirm(`Delete "${item.name}"?`)) onDelete(item.id);
              }}
            >
              {"×"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function InfoListSection({
  items,
  pending,
  onSave,
  onDelete,
}: {
  items: InfoList[];
  pending: boolean;
  onSave: (input: InfoListInput, done: () => void) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<InfoListInput | null>(null);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-semibold">Bulleted cards</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Leadership and community, awards and interests, or any card like them.
          </p>
        </div>
        <button
          type="button"
          className={`${buttonClass} ml-auto`}
          onClick={() => setEditing({ title: "", iconKey: "🌟", items: [""] })}
        >
          Add
        </button>
      </div>

      {editing && (
        <Card title={editing.id ? "Edit card" : "New card"}>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[80px_minmax(0,1fr)]">
              <Field label="Icon" required>
                <input
                  type="text"
                  value={editing.iconKey}
                  onChange={(e) => setEditing({ ...editing, iconKey: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Title" required>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Bullets">
              <BulletsEditor
                value={editing.items}
                onChange={(list) => setEditing({ ...editing, items: list })}
              />
            </Field>
            <div className="flex gap-2">
              <button
                type="button"
                className={primaryButtonClass}
                disabled={pending}
                onClick={() =>
                  onSave(
                    { ...editing, items: editing.items.filter((i) => i.trim().length > 0) },
                    () => setEditing(null),
                  )
                }
              >
                {pending ? "Saving" : "Save"}
              </button>
              <button type="button" className={buttonClass} onClick={() => setEditing(null)} disabled={pending}>
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}

      <ul className="space-y-3">
        {items.map((list) => (
          <li key={list.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-baseline gap-2">
              <span aria-hidden="true">{list.iconKey}</span>
              <p className="text-sm font-medium">{list.title}</p>
              <p className="ml-auto text-xs text-slate-400">{list.items.length} bullets</p>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className={buttonClass}
                onClick={() =>
                  setEditing({ id: list.id, title: list.title, iconKey: list.iconKey, items: list.items })
                }
              >
                Edit
              </button>
              <button
                type="button"
                className={dangerButtonClass}
                onClick={() => {
                  if (window.confirm(`Delete "${list.title}"?`)) onDelete(list.id);
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
