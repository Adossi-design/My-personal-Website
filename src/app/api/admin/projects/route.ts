import { NextResponse, type NextRequest } from "next/server";
import { ApiError, withAdmin } from "@/lib/guard";
import { createProject, listAdminProjects } from "@/lib/queries/admin-projects";
import { revalidatePublicSite } from "@/lib/revalidate";
import { projectSchema } from "@/lib/validation/project";

export async function GET() {
  return withAdmin(async () => NextResponse.json({ projects: await listAdminProjects() }));
}

export async function POST(request: NextRequest) {
  return withAdmin(async () => {
    const body = await request.json().catch(() => null);
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError("Check the highlighted fields", 422, parsed.error.flatten().fieldErrors);
    }

    const project = await createProject(parsed.data);
    revalidatePublicSite(project.slug);
    return NextResponse.json({ project }, { status: 201 });
  });
}
