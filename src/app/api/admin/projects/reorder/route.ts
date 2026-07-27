import { NextResponse, type NextRequest } from "next/server";
import { ApiError, withAdmin } from "@/lib/guard";
import { reorderFeatured } from "@/lib/queries/admin-projects";
import { revalidatePublicSite } from "@/lib/revalidate";
import { reorderSchema } from "@/lib/validation/project";

export async function POST(request: NextRequest) {
  return withAdmin(async () => {
    const body = await request.json().catch(() => null);
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) throw new ApiError("Invalid order", 422, parsed.error.flatten().fieldErrors);

    await reorderFeatured(parsed.data.ids);
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  });
}
