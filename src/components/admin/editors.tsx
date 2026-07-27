"use client";

import { useState } from "react";
import { Markdown } from "@/components/public/Markdown";
import { buttonClass, inputClass } from "./ui";

// Tag input: Enter or comma commits, Backspace on an empty field removes the last one.
export function TagInput({
  value,
  onChange,
  placeholder = "Add a tag and press Enter",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    const tag = raw.trim();
    if (!tag) return;
    if (value.includes(tag)) {
      setDraft("");
      return;
    }
    onChange([...value, tag]);
    setDraft("");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
              className="text-slate-400 hover:text-red-500"
            >
              {"×"}
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit(draft);
          } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => commit(draft)}
        className={`${inputClass} mt-2`}
      />
    </div>
  );
}

export type MetricRow = { label: string; value: string };

export function MetricsEditor({ value, onChange }: { value: MetricRow[]; onChange: (next: MetricRow[]) => void }) {
  function update(index: number, patch: Partial<MetricRow>) {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <div className="space-y-2">
      {value.map((row, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={row.label}
            onChange={(e) => update(index, { label: e.target.value })}
            placeholder="F1 score"
            aria-label={`Metric ${index + 1} label`}
            className={inputClass}
          />
          <input
            type="text"
            value={row.value}
            onChange={(e) => update(index, { value: e.target.value })}
            placeholder="0.9647"
            aria-label={`Metric ${index + 1} value`}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            aria-label={`Remove metric ${index + 1}`}
            className={buttonClass}
          >
            {"×"}
          </button>
        </div>
      ))}
      <button type="button" className={buttonClass} onClick={() => onChange([...value, { label: "", value: "" }])}>
        Add a metric
      </button>
    </div>
  );
}

// Markdown with a live preview rendered through the same sanitiser the public page uses.
export function MarkdownEditor({
  value,
  onChange,
  rows = 12,
  id,
}: {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  id?: string;
}) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="rounded-lg border border-slate-300 dark:border-slate-700">
      <div className="flex gap-1 border-b border-slate-200 p-1.5 dark:border-slate-800">
        {(["write", "preview"] as const).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setTab(name)}
            className={`rounded px-2.5 py-1 text-xs font-medium capitalize transition ${
              tab === name
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {name}
          </button>
        ))}
        <span className="ml-auto self-center pr-1 text-[11px] text-slate-400">Markdown</span>
      </div>

      {tab === "write" ? (
        <textarea
          id={id}
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-y bg-transparent px-3 py-2 font-mono text-sm outline-none"
        />
      ) : (
        <div className="px-3 py-2">
          {value.trim() ? (
            <div className="admin-preview text-sm leading-relaxed">
              <Markdown className="admin-markdown">{value}</Markdown>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
