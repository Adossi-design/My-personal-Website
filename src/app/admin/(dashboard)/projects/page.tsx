import { FeaturedSelector } from "@/components/admin/FeaturedSelector";
import { listAdminProjects } from "@/lib/queries/admin-projects";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await listAdminProjects();
  return <FeaturedSelector initial={projects} />;
}
