"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BlockType, type ContentBlock } from "@prisma/client";
import { MarkdownEditor } from "@/components/admin/editors";
import { buttonClass, inputClass, primaryButtonClass } from "@/components/admin/ui";
import { resetContentBlock, saveContentBlocks } from "./actions";

const GROUP_LABELS: Record<string, string> = {
  hero: "Hero",
  journey: "Personal journey",
  about: "About",
  what: "What I do",
  skills: "Skills",
  projects: "Projects",
  research: "Research and vision",
  experience: "Experience",
  education: "Education",
  contact: "Contact",
  footer: "Footer",
  nav: "Navigation",
};

export function ContentEditor({ blocks }: { blocks: ContentBlock[] }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    () => Object.fromEntries(blocks.map((b) => [b.id, b.value])),
  );
  const [pending, startTransition] = useTransition();

  const grouped = useMemo(() => {
    const map = new Map<string, ContentBlock[]>();
    for (const block of blocks) {
      const list = map.get(block.group) ?? [];
      list.push(block);
      map.set(block.group, list);
    }
    return [...map.entries()];
  }, [blocks]);

  const changed = useMemo(
    () => blocks.filter((b) => values[b.id] !== b.value).map((b) => ({ id: b.id, value: values[b.id] })),
    [blocks, values],
  );

  function saveAll() {
    if (changed.length === 0) {
      toast.info("Nothing has changed");
      return;
    }
    startTransition(async () => {
      const result = await saveContentBlocks(changed);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Saved ${changed.length} block${changed.length === 1 ? "" : "s"}`);
      router.refresh();
    });
  }

  function reset(block: ContentBlock) {
    startTransition(async () => {
      const result = await resetContentBlock(block.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setValues((current) => ({ ...current, [block.id]: block.defaultValue }));
      toast.success("Reset to the original");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold">Site copy</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {blocks.length} editable blocks. Nothing on the public site is hardcoded.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {changed.length > 0 && (
            <span className="text-xs text-amber-600 dark:text-amber-400">
              {changed.length} unsaved change{changed.length === 1 ? "" : "s"}
            </span>
          )}
          <button type="button" className={primaryButtonClass} onClick={saveAll} disabled={pending || changed.length === 0}>
            {pending ? "Saving" : "Save all"}
          </button>
        </div>
      </div>

      {grouped.map(([group, groupBlocks]) => (
        <section key={group} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <h2 className="text-sm font-semibold">{GROUP_LABELS[group] ?? group}</h2>
          <div className="mt-4 space-y-5">
            {groupBlocks.map((block) => {
              const isChanged = values[block.id] !== block.value;
              const isDefault = values[block.id] === block.defaultValue;
              return (
                <div key={block.id}>
                  <div className="flex items-baseline gap-2">
                    <label htmlFor={block.id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {block.label}
                    </label>
                    {isChanged && <span className="text-[11px] text-amber-600 dark:text-amber-400">edited</span>}
                    {!isDefault && (
                      <button
                        type="button"
                        onClick={() => reset(block)}
                        disabled={pending}
                        className="ml-auto text-[11px] text-slate-500 underline hover:text-slate-900 dark:hover:text-slate-100"
                      >
                        Reset to original
                      </button>
                    )}
                  </div>
                  <p className="mb-1 font-mono text-[11px] text-slate-400">{block.key}</p>

                  {block.type === BlockType.MARKDOWN ? (
                    <MarkdownEditor
                      id={block.id}
                      rows={6}
                      value={values[block.id]}
                      onChange={(v) => setValues((c) => ({ ...c, [block.id]: v }))}
                    />
                  ) : block.type === BlockType.TEXTAREA ? (
                    <textarea
                      id={block.id}
                      rows={4}
                      value={values[block.id]}
                      onChange={(e) => setValues((c) => ({ ...c, [block.id]: e.target.value }))}
                      className={inputClass}
                    />
                  ) : (
                    <input
                      id={block.id}
                      type="text"
                      value={values[block.id]}
                      onChange={(e) => setValues((c) => ({ ...c, [block.id]: e.target.value }))}
                      className={inputClass}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="flex justify-end">
        <button type="button" className={buttonClass} onClick={saveAll} disabled={pending || changed.length === 0}>
          Save all
        </button>
      </div>
    </div>
  );
}
