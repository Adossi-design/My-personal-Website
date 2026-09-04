import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nav, type NavLink } from "@/components/public/Nav";
import { SiteAtmosphere } from "@/components/public/SiteAtmosphere";
import { getCopy } from "@/lib/queries/content";
import { getSettings } from "@/lib/queries/site";
import { siteUrl } from "@/lib/env";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const base = siteUrl();
  return {
    metadataBase: new URL(base),
    title: settings.metaTitle,
    description: settings.metaDescription,
    authors: [{ name: settings.name }],
    openGraph: {
      title: settings.metaTitle,
      description: settings.metaDescription,
      type: "website",
      url: base,
      images: settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [copy, settings] = await Promise.all([getCopy(), getSettings()]);

  const links: NavLink[] = [
    { href: "/#about", label: copy("nav.about"), sectionId: "about" },
    { href: "/#journey", label: copy("nav.journey"), sectionId: "journey" },
    { href: "/#projects", label: copy("nav.projects"), sectionId: "projects" },
    { href: "/#experience", label: copy("nav.experience"), sectionId: "experience" },
    { href: "/#skills", label: copy("nav.skills"), sectionId: "skills" },
    { href: "/#research", label: copy("nav.research"), sectionId: "research" },
    { href: "/#contact", label: copy("nav.contact"), sectionId: "contact" },
  ];

  return (
    <>
      <SiteAtmosphere />
      <Nav brand={settings.name} links={links} />
      {children}
      <footer>
        <div className="wrap">
          {"© "}
          {new Date().getFullYear()} {settings.name} {"·"} {copy("footer.text")}
        </div>
      </footer>
    </>
  );
}
