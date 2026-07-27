"use client";

import { useEffect, useRef, useState } from "react";
import type { CardProject } from "@/components/public/ProjectCard";

// Posts form state into the preview route, which renders the genuine card component.
export function CardPreview({ project }: { project: CardProject }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if ((event.data as { type?: string })?.type === "card-preview-ready") setReady(true);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    frameRef.current?.contentWindow?.postMessage(
      { type: "card-preview", project },
      window.location.origin,
    );
  }, [ready, project]);

  // The public site is themeable, so the preview can be checked in both palettes.
  useEffect(() => {
    if (!ready) return;
    const doc = frameRef.current?.contentDocument;
    doc?.documentElement.setAttribute("data-theme", theme);
  }, [ready, theme]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
        <h2 className="text-sm font-semibold">Card preview</h2>
        <div className="ml-auto flex gap-1">
          {(["dark", "light"] as const).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setTheme(name)}
              className={`rounded px-2 py-1 text-xs capitalize transition ${
                theme === name
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <iframe
        ref={frameRef}
        src="/preview/card"
        title="Live card preview"
        className="h-[460px] w-full rounded-b-xl"
      />
    </div>
  );
}
