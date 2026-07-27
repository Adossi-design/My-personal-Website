import { NextResponse, type NextRequest } from "next/server";
import { del, put } from "@vercel/blob";
import { z } from "zod";
import { ApiError, withAdmin } from "@/lib/guard";
import { isBlobConfigured } from "@/lib/env";
import {
  formatBytes,
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_PDF_BYTES,
  MAX_VIDEO_BYTES,
  PDF_TYPES,
  VIDEO_TYPES,
} from "@/lib/media";

const kindSchema = z.enum(["image", "video", "pdf"]);

const RULES = {
  image: { types: IMAGE_TYPES as readonly string[], max: MAX_IMAGE_BYTES, label: "JPG, PNG or WebP" },
  video: { types: VIDEO_TYPES as readonly string[], max: MAX_VIDEO_BYTES, label: "MP4 or WebM" },
  pdf: { types: PDF_TYPES as readonly string[], max: MAX_PDF_BYTES, label: "PDF" },
} as const;

export async function POST(request: NextRequest) {
  return withAdmin(async () => {
    if (!isBlobConfigured()) {
      throw new ApiError(
        "Blob storage is not configured. Set BLOB_READ_WRITE_TOKEN to a real token from Vercel.",
        503,
      );
    }

    const form = await request.formData().catch(() => null);
    if (!form) throw new ApiError("Expected a file upload", 400);

    const file = form.get("file");
    const kindResult = kindSchema.safeParse(form.get("kind"));
    if (!(file instanceof File)) throw new ApiError("No file was attached", 400);
    if (!kindResult.success) throw new ApiError("Unknown upload kind", 400);

    const rule = RULES[kindResult.data];

    // Both checks matter: the browser can lie about type, and size is capped
    // here rather than trusting whatever the form claimed.
    if (!rule.types.includes(file.type)) {
      throw new ApiError(`That file type is not allowed. Use ${rule.label}.`, 415);
    }
    if (file.size > rule.max) {
      throw new ApiError(`That file is ${formatBytes(file.size)}. The limit is ${formatBytes(rule.max)}.`, 413);
    }
    if (file.size === 0) throw new ApiError("That file is empty", 400);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80) || "upload";
    const blob = await putOrExplain(`portfolio/${kindResult.data}/${Date.now()}-${safeName}`, file);

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type,
      size: file.size,
    });
  });
}

// A bad token or a missing store surfaces as a generic error from the SDK, which
// reads as "something went wrong" and tells the admin nothing actionable.
async function putOrExplain(pathname: string, file: File) {
  try {
    return await put(pathname, file, { access: "public", contentType: file.type, addRandomSuffix: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/store does not exist/i.test(message)) {
      throw new ApiError(
        "The blob store could not be found. Create a Blob store in Vercel and copy its token into BLOB_READ_WRITE_TOKEN.",
        503,
      );
    }
    if (/unauthorized|forbidden|invalid token/i.test(message)) {
      throw new ApiError("Blob storage rejected the token. Check BLOB_READ_WRITE_TOKEN.", 503);
    }
    throw error;
  }
}

const deleteSchema = z.object({ url: z.string().url() });

export async function DELETE(request: NextRequest) {
  return withAdmin(async () => {
    if (!isBlobConfigured()) throw new ApiError("Blob storage is not configured", 503);

    const body = await request.json().catch(() => null);
    const parsed = deleteSchema.safeParse(body);
    if (!parsed.success) throw new ApiError("A blob URL is required", 422);

    // Only blobs from this store can be removed, so an arbitrary URL is refused.
    if (!parsed.data.url.includes(".public.blob.vercel-storage.com")) {
      throw new ApiError("That URL is not a stored upload", 400);
    }

    await del(parsed.data.url);
    return NextResponse.json({ ok: true });
  });
}
