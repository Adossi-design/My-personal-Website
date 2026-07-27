import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ApiError, withAdmin } from "@/lib/guard";
import { deleteProject, updateProject } from "@/lib/queries/admin-projects";
import { revalidatePublicSite } from "@/lib/revalidate";
import { projectSchema } from "@/lib/validation/project";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    const project = await db.project.findUnique({ where: { id } });
    if (!project) throw new ApiError("Project not found", 404);
    return NextResponse.json({ project });
  });
}

export async function PUT(request: NextRequest, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError("Check the highlighted fields", 422, parsed.error.flatten().fieldErrors);
    }

    const previous = await db.project.findUnique({ where: { id }, select: { slug: true } });
    const project = await updateProject(id, parsed.data);
    revalidatePublicSite(project.slug);
    // A renamed project leaves its old path cached, so that one is cleared too.
    if (previous && previous.slug !== project.slug) revalidatePublicSite(previous.slug);
    return NextResponse.json({ project });
  });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    const existing = await db.project.findUnique({ where: { id }, select: { slug: true } });
    await deleteProject(id);
    revalidatePublicSite(existing?.slug);
    return NextResponse.json({ ok: true });
  });
}
