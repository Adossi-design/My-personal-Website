import { revalidatePath } from "next/cache";

// Called after every mutation so the public site updates without a redeploy.
export function revalidatePublicSite(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  if (slug) revalidatePath(`/projects/${slug}`);
  else revalidatePath("/projects/[slug]", "page");
}
