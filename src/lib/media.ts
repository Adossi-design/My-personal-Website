// Turns a pasted YouTube or Vimeo link into an embeddable URL plus a thumbnail.
export type Embed = { provider: "youtube" | "vimeo"; id: string; embedUrl: string; thumbnailUrl: string | null };

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"]);
const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);

export function parseEmbed(raw: string): Embed | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  if (YOUTUBE_HOSTS.has(url.hostname)) {
    const id = youtubeId(url);
    if (!id) return null;
    return {
      provider: "youtube",
      id,
      embedUrl: `https://www.youtube.com/embed/${id}?rel=0`,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  if (VIMEO_HOSTS.has(url.hostname)) {
    const id = url.pathname.split("/").filter(Boolean).pop();
    if (!id || !/^\d+$/.test(id)) return null;
    return { provider: "vimeo", id, embedUrl: `https://player.vimeo.com/video/${id}`, thumbnailUrl: null };
  }

  return null;
}

function youtubeId(url: URL): string | null {
  if (url.hostname.endsWith("youtu.be")) {
    const id = url.pathname.slice(1);
    return /^[\w-]{11}$/.test(id) ? id : null;
  }
  const v = url.searchParams.get("v");
  if (v && /^[\w-]{11}$/.test(v)) return v;
  const parts = url.pathname.split("/").filter(Boolean);
  const afterKeyword = parts[0] === "embed" || parts[0] === "shorts" ? parts[1] : null;
  return afterKeyword && /^[\w-]{11}$/.test(afterKeyword) ? afterKeyword : null;
}

export const isEmbeddableUrl = (raw: string) => parseEmbed(raw) !== null;

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const VIDEO_TYPES = ["video/mp4", "video/webm"] as const;
export const PDF_TYPES = ["application/pdf"] as const;

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
export const MAX_PDF_BYTES = 15 * 1024 * 1024;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
