import { isBlobConfigured } from "@/lib/env";
import { getSettings } from "@/lib/queries/site";
import type { SettingsInput } from "@/lib/validation/settings";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  const initial: SettingsInput = {
    name: settings.name,
    roleTitle: settings.roleTitle,
    email: settings.email,
    phone: settings.phone,
    location: settings.location,
    githubUrl: settings.githubUrl,
    linkedinUrl: settings.linkedinUrl,
    availabilityText: settings.availabilityText,
    availabilityOn: settings.availabilityOn,
    heroPhotoUrl: settings.heroPhotoUrl,
    resumePdfUrl: settings.resumePdfUrl,
    metaTitle: settings.metaTitle,
    metaDescription: settings.metaDescription,
    ogImageUrl: settings.ogImageUrl,
  };

  return <SettingsForm initial={initial} blobReady={isBlobConfigured()} />;
}
