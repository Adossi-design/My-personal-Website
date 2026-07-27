"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { formatBytes, IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_PDF_BYTES, MAX_VIDEO_BYTES, VIDEO_TYPES } from "@/lib/media";
import { buttonClass } from "./ui";

type Kind = "image" | "video" | "pdf";

const ACCEPT: Record<Kind, string> = {
  image: IMAGE_TYPES.join(","),
  video: VIDEO_TYPES.join(","),
  pdf: "application/pdf",
};

const LIMITS: Record<Kind, number> = {
  image: MAX_IMAGE_BYTES,
  video: MAX_VIDEO_BYTES,
  pdf: MAX_PDF_BYTES,
};

type Props = {
  kind: Kind;
  value: string | null;
  onChange: (url: string | null) => void;
  label: string;
};

// Progress needs XMLHttpRequest, because fetch cannot report upload progress.
export function MediaUploader({ kind, value, onChange, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  function upload(file: File) {
    if (file.size > LIMITS[kind]) {
      toast.error(`That file is ${formatBytes(file.size)}. The limit is ${formatBytes(LIMITS[kind])}.`);
      return;
    }
    if (!ACCEPT[kind].split(",").includes(file.type)) {
      toast.error("That file type is not allowed here");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("kind", kind);

    const request = new XMLHttpRequest();
    request.open("POST", "/api/admin/upload");
    setProgress(0);

    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
    });

    request.addEventListener("load", () => {
      setProgress(null);
      if (request.status >= 200 && request.status < 300) {
        const data = JSON.parse(request.responseText);
        onChange(data.url);
        toast.success("Upload complete");
      } else {
        const message = safeError(request.responseText);
        toast.error(message);
      }
    });

    request.addEventListener("error", () => {
      setProgress(null);
      toast.error("The upload failed");
    });

    request.send(form);
  }

  async function removeCurrent() {
    const url = value;
    onChange(null);
    if (!url || !url.includes(".public.blob.vercel-storage.com")) return;
    // Removing the stored blob too, so unused files do not pile up.
    await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }).catch(() => undefined);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        className={`rounded-lg border-2 border-dashed p-4 text-center transition ${
          dragging
            ? "border-slate-500 bg-slate-50 dark:bg-slate-800"
            : "border-slate-300 dark:border-slate-700"
        }`}
      >
        {value ? (
          <div className="space-y-2">
            <Preview kind={kind} url={value} />
            <div className="flex justify-center gap-2">
              <button type="button" className={buttonClass} onClick={() => inputRef.current?.click()}>
                Replace
              </button>
              <button type="button" className={buttonClass} onClick={removeCurrent}>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-400">Drop {label} here</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Up to {formatBytes(LIMITS[kind])}
            </p>
            <button type="button" className={`${buttonClass} mt-2`} onClick={() => inputRef.current?.click()}>
              Choose a file
            </button>
          </>
        )}

        {progress !== null && (
          <div className="mt-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full bg-slate-900 transition-all dark:bg-slate-100" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-slate-500">Uploading, {progress}%</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[kind]}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Preview({ kind, url }: { kind: Kind; url: string }) {
  if (kind === "image") {
    return <img src={url} alt="" className="mx-auto max-h-40 rounded object-contain" />;
  }
  if (kind === "video") {
    return <video src={url} controls className="mx-auto max-h-40 rounded" />;
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm underline">
      Open the uploaded PDF
    </a>
  );
}

function safeError(body: string): string {
  try {
    return JSON.parse(body).error ?? "The upload was rejected";
  } catch {
    return "The upload was rejected";
  }
}
