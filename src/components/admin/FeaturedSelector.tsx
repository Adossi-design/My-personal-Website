"use client";

import Link from "next/link";
import { useMemo, useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import { Category, MediaType } from "@prisma/client";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FILTER_LABELS } from "@/lib/queries/projects";
import { FEATURED_LIMIT } from "@/config/site";
import type { AdminProjectRow } from "@/lib/queries/admin-projects";
import { buttonClass, dangerButtonClass, inputClass, primaryButtonClass } from "./ui";

type Props = { initial: AdminProjectRow[] };
type PublishedFilter = "all" | "published" | "draft";

export function FeaturedSelector({ initial }: Props) {
  const [rows, setRows] = useState(initial);
  const [optimisticRows, applyOptimistic] = useOptimistic(
    rows,
    (state: AdminProjectRow[], change: { id: string; featured: boolean }) =>
      state.map((row) => (row.id === change.id ? { ...row, featured: change.featured } : row)),
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [publishedFilter, setPublishedFilter] = useState<PublishedFilter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const featuredCount = optimisticRows.filter((r) => r.featured).length;
  const atCapacity = featuredCount >= FEATURED_LIMIT;

  const featured = useMemo(
    () =>
      optimisticRows
        .filter((r) => r.featured)
        .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99)),
    [optimisticRows],
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return optimisticRows.filter((row) => {
      if (category !== "all" && row.category !== category) return false;
      if (publishedFilter === "published" && !row.published) return false;
      if (publishedFilter === "draft" && row.published) return false;
      if (term && !row.title.toLowerCase().includes(term) && !row.domain.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [optimisticRows, search, category, publishedFilter]);

  async function toggleFeatured(row: AdminProjectRow) {
    const next = !row.featured;
    if (next && atCapacity) {
      toast.error(`Already ${FEATURED_LIMIT} featured. Unfeature one first.`);
      return;
    }

    startTransition(async () => {
      applyOptimistic({ id: row.id, featured: next });
      const response = await fetch("/api/admin/projects/feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, featured: next }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error ?? "Could not save that");
        return;
      }

      await refresh();
      toast.success(next ? `${row.title} is on the homepage` : `${row.title} removed from the homepage`);
    });
  }

  async function refresh() {
    const response = await fetch("/api/admin/projects");
    if (!response.ok) return;
    const data = await response.json();
    setRows(data.projects);
  }

  async function persistOrder(ids: string[]) {
    const response = await fetch("/api/admin/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      toast.error(data.error ?? "Could not save the new order");
      await refresh();
      return;
    }
    toast.success("Homepage order saved");
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = featured.map((f) => f.id);
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from === -1 || to === -1) return;

    const reordered = arrayMove(ids, from, to);
    setRows((current) =>
      current.map((row) => {
        const index = reordered.indexOf(row.id);
        return index === -1 ? row : { ...row, featuredOrder: index + 1 };
      }),
    );
    startTransition(() => persistOrder(reordered));
  }

  async function runBulk(action: "publish" | "unpublish" | "delete") {
    const ids = [...selected];
    if (ids.length === 0) return;
    if (action === "delete") {
      const ok = window.confirm(
        `Delete ${ids.length} project${ids.length === 1 ? "" : "s"}? This cannot be undone.`,
      );
      if (!ok) return;
    }

    startTransition(async () => {
      const response = await fetch("/api/admin/projects/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error ?? "Could not complete that");
        return;
      }
      setSelected(new Set());
      await refresh();
      toast.success(`${ids.length} project${ids.length === 1 ? "" : "s"} updated`);
    });
  }

  function toggleSelected(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {optimisticRows.length} total. Star up to {FEATURED_LIMIT} for the homepage.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              atCapacity
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
            }`}
          >
            Featured: {featuredCount} of {FEATURED_LIMIT}
          </span>
          <Link href="/admin/projects/new" className={primaryButtonClass}>
            New project
          </Link>
        </div>
      </div>

      {featured.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold">Homepage order</h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Drag to reorder. Position 1 appears first in the grid.
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={featured.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              <ul className="mt-3 space-y-2">
                {featured.map((row, index) => (
                  <SortableRow key={row.id} row={row} position={index + 1} onUnfeature={() => toggleFeatured(row)} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or domain"
            aria-label="Search projects"
            className={`${inputClass} sm:max-w-xs`}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "all")}
            aria-label="Filter by category"
            className={`${inputClass} sm:w-auto`}
          >
            <option value="all">All categories</option>
            {Object.values(Category).map((value) => (
              <option key={value} value={value}>
                {FILTER_LABELS[value]}
              </option>
            ))}
          </select>
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value as PublishedFilter)}
            aria-label="Filter by state"
            className={`${inputClass} sm:w-auto`}
          >
            <option value="all">Published and drafts</option>
            <option value="published">Published only</option>
            <option value="draft">Drafts only</option>
          </select>
        </div>

        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950/50">
            <span className="text-xs text-slate-600 dark:text-slate-400">{selected.size} selected</span>
            <button type="button" className={buttonClass} disabled={pending} onClick={() => runBulk("publish")}>
              Publish
            </button>
            <button type="button" className={buttonClass} disabled={pending} onClick={() => runBulk("unpublish")}>
              Unpublish
            </button>
            <button type="button" className={dangerButtonClass} disabled={pending} onClick={() => runBulk("delete")}>
              Delete
            </button>
          </div>
        )}

        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {visible.map((row) => {
            const blocked = !row.featured && atCapacity;
            return (
              <li key={row.id} className="flex items-center gap-3 p-3">
                <input
                  type="checkbox"
                  checked={selected.has(row.id)}
                  onChange={() => toggleSelected(row.id)}
                  aria-label={`Select ${row.title}`}
                  className="size-4 shrink-0"
                />

                <button
                  type="button"
                  onClick={() => toggleFeatured(row)}
                  disabled={blocked || pending}
                  title={
                    blocked
                      ? `Already ${FEATURED_LIMIT} featured. Unfeature one first.`
                      : row.featured
                        ? "Remove from the homepage"
                        : "Feature on the homepage"
                  }
                  aria-pressed={row.featured}
                  aria-label={row.featured ? `Unfeature ${row.title}` : `Feature ${row.title}`}
                  className={`shrink-0 rounded-lg px-2 py-1 text-lg leading-none transition ${
                    row.featured ? "text-amber-500" : "text-slate-300 hover:text-amber-400 dark:text-slate-600"
                  } ${blocked ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {row.featured ? "★" : "☆"}
                </button>

                <Thumb row={row} />

                <div className="min-w-0 flex-1">
                  <Link href={`/admin/projects/${row.id}`} className="block truncate text-sm font-medium hover:underline">
                    {row.title}
                  </Link>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {FILTER_LABELS[row.category]} {"·"} {row.domain}
                  </p>
                </div>

                {row.featured && row.featuredOrder && (
                  <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    #{row.featuredOrder}
                  </span>
                )}
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide ${
                    row.published
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {row.published ? "Live" : "Draft"}
                </span>
              </li>
            );
          })}
        </ul>

        {visible.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Nothing matches those filters.
          </p>
        )}
      </section>
    </div>
  );
}

function Thumb({ row }: { row: AdminProjectRow }) {
  const src = row.mediaType === MediaType.IMAGE ? row.mediaUrl : row.posterUrl;
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="hidden size-10 shrink-0 rounded object-cover sm:block"
        loading="lazy"
      />
    );
  }
  return (
    <span className="hidden size-10 shrink-0 place-items-center rounded bg-slate-100 text-lg sm:grid dark:bg-slate-800">
      {row.iconKey}
    </span>
  );
}

function SortableRow({
  row,
  position,
  onUnfeature,
}: {
  row: AdminProjectRow;
  position: number;
  onUnfeature: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950/50 ${
        isDragging ? "opacity-70 shadow-lg" : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${row.title}`}
        className="cursor-grab rounded px-1.5 py-1 text-slate-400 hover:bg-slate-200 active:cursor-grabbing dark:hover:bg-slate-800"
      >
        {"⠿"}
      </button>
      <span className="w-5 shrink-0 text-center text-xs font-semibold tabular-nums text-slate-500">{position}</span>
      <Thumb row={row} />
      <span className="min-w-0 flex-1 truncate text-sm">{row.title}</span>
      <button type="button" onClick={onUnfeature} className={buttonClass} aria-label={`Unfeature ${row.title}`}>
        Remove
      </button>
    </li>
  );
}
