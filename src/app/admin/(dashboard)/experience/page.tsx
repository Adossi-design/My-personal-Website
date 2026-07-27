import { getExperience } from "@/lib/queries/site";
import { ExperienceEditor } from "./ExperienceEditor";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  return <ExperienceEditor initial={await getExperience()} />;
}
