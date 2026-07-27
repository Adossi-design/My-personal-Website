import { NextResponse, type NextRequest } from "next/server";
import { ApiError, withAdmin } from "@/lib/guard";
import { countFeatured, FEATURED_LIMIT, setFeatured } from "@/lib/queries/admin-projects";
import { revalidatePublicSite } from "@/lib/revalidate";
import { featureToggleSchema } from "@/lib/validation/project";

// One click on a star lands here. The cap is checked server-side, because the
// client is not a security boundary.
export async function POST(request: NextRequest) {
  return withAdmin(async () => {
    const body = await request.json().catch(() => null);
    const parsed = featureToggleSchema.safeParse(body);
    if (!parsed.success) throw new ApiError("Invalid request", 422, parsed.error.flatten().fieldErrors);

    const project = await setFeatured(parsed.data.id, parsed.data.featured);
    revalidatePublicSite();

    return NextResponse.json({
      id: project.id,
      featured: parsed.data.featured,
      featuredCount: await countFeatured(),
      limit: FEATURED_LIMIT,
    });
  });
}
