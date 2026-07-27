"use client";

import type { ReactNode } from "react";
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
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Shared drag-to-reorder wrapper, so every admin list behaves the same way.
export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  children,
}: {
  items: T[];
  onReorder: (ids: string[]) => void;
  children: (item: T, index: number) => ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = items.map((i) => i.id);
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    onReorder(arrayMove(ids, from, to));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id}>
              {children(item, index)}
            </SortableItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${
        isDragging ? "opacity-70 shadow-lg" : ""
      }`}
    >
      <div className="flex items-start gap-2 p-3 sm:p-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Reorder"
          className="mt-1 cursor-grab rounded px-1.5 py-1 text-slate-400 hover:bg-slate-100 active:cursor-grabbing dark:hover:bg-slate-800"
        >
          {"⠿"}
        </button>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </li>
  );
}
