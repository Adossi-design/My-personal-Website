import { db } from "@/lib/db";
import { contentBlocks as seeded } from "@/content/copy";

// Seeded copy is the fallback, so a missing row shows the launch text rather than a blank gap.
const fallback = new Map(seeded.map((b) => [b.key, b.value]));

export type Copy = (key: string) => string;

// One query per page, then every section reads from the returned lookup.
export async function getCopy(): Promise<Copy> {
  const rows = await db.contentBlock.findMany({ select: { key: true, value: true } });
  const live = new Map(rows.map((r) => [r.key, r.value]));
  return (key: string) => live.get(key) ?? fallback.get(key) ?? "";
}

