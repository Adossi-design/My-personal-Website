import { Category, MediaType } from "@prisma/client";
import { z } from "zod";
import { isEmbeddableUrl } from "@/lib/media";

const optionalUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === "" || /^https?:\/\/.+/.test(v), "Must start with http:// or https://")
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

export const metricSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(60),
  value: z.string().trim().min(1, "Value is required").max(60),
});

export const projectSchema = z
  .object({
    title: z.string().trim().min(2, "Title is required").max(160),
    slug: z
      .string()
      .trim()
      .min(1, "Slug is required")
      .max(80)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
    domain: z.string().trim().min(1, "Domain label is required").max(80),
    category: z.nativeEnum(Category),
    iconKey: z.string().trim().min(1, "Pick an icon").max(8),
    shortDescription: z
      .string()
      .trim()
      .min(10, "Write at least a short line")
      .max(180, "Keep the card line to 180 characters"),
    fullDescription: z.string().trim().min(10, "The detail page needs a description"),
    mediaType: z.nativeEnum(MediaType),
    mediaUrl: optionalUrl,
    posterUrl: optionalUrl,
    mediaAlt: z.string().trim().max(200).default(""),
    techStack: z.array(z.string().trim().min(1).max(40)).max(30, "Thirty tags is plenty").default([]),
    repoUrl: optionalUrl,
    liveUrl: optionalUrl,
    metrics: z.array(metricSchema).max(12, "Twelve metrics is plenty").default([]),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    sortOrder: z.number().int().min(0).max(9999).default(0),
  })
  // Alt text is only meaningful once there is an image to describe.
  .refine((v) => v.mediaType !== MediaType.IMAGE || v.mediaAlt.trim().length > 0, {
    path: ["mediaAlt"],
    message: "Alt text is required for images",
  })
  .refine((v) => v.mediaType === MediaType.NONE || Boolean(v.mediaUrl), {
    path: ["mediaUrl"],
    message: "Add a file or a URL, or set the media type to None",
  })
  .refine((v) => v.mediaType !== MediaType.VIDEO_EMBED || !v.mediaUrl || isEmbeddableUrl(v.mediaUrl), {
    path: ["mediaUrl"],
    message: "Paste a YouTube or Vimeo link",
  });

export const featureToggleSchema = z.object({
  id: z.string().cuid(),
  featured: z.boolean(),
});

export const reorderSchema = z.object({
  ids: z.array(z.string().cuid()).min(1).max(6),
});

export const bulkSchema = z.object({
  ids: z.array(z.string().cuid()).min(1).max(200),
  action: z.enum(["publish", "unpublish", "delete"]),
});

export type ProjectInput = z.infer<typeof projectSchema>;
