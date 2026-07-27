import { getSkillTiers } from "@/lib/queries/site";
import { SkillsEditor } from "./SkillsEditor";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  return <SkillsEditor initial={await getSkillTiers()} />;
}
