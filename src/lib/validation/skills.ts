import { z } from "zod";

export const skillTierSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().trim().min(2, "Name is required").max(120),
  subtitle: z.string().trim().max(160).default(""),
  // Filled segments of the ten-segment bar on the public site.
  level: z.coerce.number().int().min(0, "Between 0 and 10").max(10, "Between 0 and 10"),
  items: z.array(z.string().trim().min(1).max(60)).max(80, "Eighty skills is plenty").default([]),
});

const cardSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().trim().min(2, "Title is required").max(140),
  description: z.string().trim().min(10, "Description is required").max(1500),
  iconKey: z.string().trim().min(1, "Pick an icon").max(8),
});

export const capabilitySchema = cardSchema;
export const domainSchema = cardSchema;

export type SkillTierInput = z.infer<typeof skillTierSchema>;
export type CardInput = z.infer<typeof cardSchema>;
