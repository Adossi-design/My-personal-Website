import { NextResponse, type NextRequest } from "next/server";
import { del } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { z } from "zod";
import { ApiError, requireAdmin, UnauthorizedError, withAdmin } from "@/lib/guard";
import { isBlobConfigured } from "@/lib/env";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_PDF_BYTES, MAX_VIDEO_BYTES, PDF_TYPES, VIDEO_TYPES } from "@/lib/media";

const kindSchema = z.enum(["image", "video", "pdf"]);

const RULES = {
  image: { types: IMAGE_TYPES as readonly string[], max: MAX_IMAGE_BYTES, label: "JPG, PNG or WebP" },
  video: { types: VIDEO_TYPES as readonly string[], max: MAX_VIDEO_BYTES, label: "MP4 or WebM" },
  pdf: { types: PDF_TYPES as readonly string[], max: MAX_PDF_BYTES, label: "PDF" },
} as const;

// The browser sends the file straight to blob storage and only asks this route for a
// signed token. Routing the bytes through the function instead would cap every upload
// at the 4.5 MB serverless request limit, well below the sizes the admin advertises.
export async function POST(request: NextRequest) {
  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: "Blob storage is not configured. Set BLOB_READ_WRITE_TOKEN to a real token from Vercel." },
      { status: 503 },
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Expected an upload request" }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      // Runs before any byte is accepted, so the type and size ceiling are still
      // enforced by the server even though the upload never passes through it.
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        await requireAdmin();

        const parsed = kindSchema.safeParse(clientPayload);
        if (!parsed.success) throw new ApiError("Unknown upload kind", 400);
        const rule = RULES[parsed.data];

        return {
          allowedContentTypes: [...rule.types],
          maximumSizeInBytes: rule.max,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Nothing to record: the project row stores the URL when the form is saved.
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    // An auth failure has to stay a 401, otherwise a client cannot tell a rejected
    // request apart from an expired session.
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "The upload was rejected";
    const status = error instanceof ApiError ? error.status : 400;
    return NextResponse.json({ error: message }, { status });
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
