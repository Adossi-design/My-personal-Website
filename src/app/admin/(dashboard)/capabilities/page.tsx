import { getCapabilities, getCoursework, getDomains, getHeroStats, getInfoLists } from "@/lib/queries/site";
import { CapabilitiesEditor } from "./CapabilitiesEditor";

export const dynamic = "force-dynamic";

export default async function AdminCapabilitiesPage() {
  const [capabilities, domains, heroStats, coursework, infoLists] = await Promise.all([
    getCapabilities(),
    getDomains(),
    getHeroStats(),
    getCoursework(),
    getInfoLists(),
  ]);

  return (
    <CapabilitiesEditor
      capabilities={capabilities}
      domains={domains}
      heroStats={heroStats}
      coursework={coursework}
      infoLists={infoLists}
    />
  );
}
