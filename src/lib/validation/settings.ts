import { z } from "zod";

const nullableUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === "" || /^https?:\/\/.+/.test(v) || v.startsWith("/"), "Must be a URL or a path starting with /")
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .default(null);

export const settingsSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  roleTitle: z.string().trim().min(2, "Role title is required").max(200),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(3, "Phone is required").max(40),
  location: z.string().trim().min(2, "Location is required").max(120),
  githubUrl: z.string().trim().url("Enter a valid URL"),
  linkedinUrl: z.string().trim().url("Enter a valid URL"),
  availabilityText: z.string().trim().max(200).default(""),
  availabilityOn: z.boolean().default(true),
  heroPhotoUrl: nullableUrl,
  resumePdfUrl: nullableUrl,
  metaTitle: z.string().trim().min(4, "Meta title is required").max(200),
  metaDescription: z.string().trim().min(20, "Write at least a sentence").max(400),
  ogImageUrl: nullableUrl,
});

export const heroStatSchema = z.object({
  id: z.string().cuid().optional(),
  value: z.string().trim().min(1, "Value is required").max(20),
  label: z.string().trim().min(2, "Label is required").max(80),
});

export const courseworkSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().trim().min(1, "Name is required").max(140),
  repo: z.string().trim().min(1, "Repository name is required").max(200),
});

export const infoListSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().trim().min(2, "Title is required").max(140),
  iconKey: z.string().trim().min(1, "Pick an icon").max(8),
  items: z.array(z.string().trim().min(1).max(1200)).max(12, "Twelve bullets is plenty").default([]),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
export type HeroStatInput = z.infer<typeof heroStatSchema>;
export type CourseworkInput = z.infer<typeof courseworkSchema>;
export type InfoListInput = z.infer<typeof infoListSchema>;
