import { NextResponse, type NextRequest } from "next/server";
import { ApiError, withAdmin } from "@/lib/guard";
import { bulkAction } from "@/lib/queries/admin-projects";
import { revalidatePublicSite } from "@/lib/revalidate";
import { bulkSchema } from "@/lib/validation/project";

export async function POST(request: NextRequest) {
  return withAdmin(async () => {
    const body = await request.json().catch(() => null);
    const parsed = bulkSchema.safeParse(body);
    if (!parsed.success) throw new ApiError("Invalid request", 422, parsed.error.flatten().fieldErrors);

    const result = await bulkAction(parsed.data.ids, parsed.data.action);
    revalidatePublicSite();
    return NextResponse.json(result);
  });
}
