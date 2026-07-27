import { getCertifications, getEducation } from "@/lib/queries/site";
import { EducationEditor } from "./EducationEditor";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const [education, certifications] = await Promise.all([getEducation(), getCertifications()]);
  return <EducationEditor education={education} certifications={certifications} />;
}
