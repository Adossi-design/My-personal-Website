import { db } from "@/lib/db";
import { ContentEditor } from "./ContentEditor";

export const dynamic = "force-dynamic";

const GROUP_ORDER = [
  "hero",
  "journey",
  "about",
  "what",
  "skills",
  "projects",
  "research",
  "experience",
  "education",
  "contact",
  "footer",
  "nav",
];

export default async function AdminContentPage() {
  const blocks = await db.contentBlock.findMany({ orderBy: { sortOrder: "asc" } });

  // Sorted by section as it appears on the page, not alphabetically.
  const ordered = [...blocks].sort((a, b) => {
    const groupDiff = GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
    return groupDiff !== 0 ? groupDiff : a.sortOrder - b.sortOrder;
  });

  return <ContentEditor blocks={ordered} />;
}
