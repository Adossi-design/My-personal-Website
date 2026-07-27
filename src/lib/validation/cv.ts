import { z } from "zod";

const bullets = z
  .array(z.string().trim().min(1, "An empty bullet cannot be saved").max(1200))
  .max(12, "Twelve bullets is plenty")
  .default([]);

export const experienceSchema = z.object({
  id: z.string().cuid().optional(),
  role: z.string().trim().min(2, "Role is required").max(140),
  organisation: z.string().trim().min(1, "Organisation is required").max(140),
  period: z.string().trim().min(1, "Period is required").max(80),
  location: z.string().trim().max(80).default(""),
  bullets,
});

export const educationSchema = z.object({
  id: z.string().cuid().optional(),
  degree: z.string().trim().min(2, "Degree is required").max(160),
  institution: z.string().trim().min(2, "Institution is required").max(200),
  period: z.string().trim().min(1, "Period is required").max(120),
  meta: z.string().trim().max(1200).default(""),
  note: z.string().trim().max(1200).default(""),
  iconKey: z.string().trim().min(1).max(8).default("🎓"),
  grades: z
    .array(
      z.object({
        course: z.string().trim().min(1, "Course is required").max(120),
        score: z.string().trim().min(1, "Score is required").max(20),
      }),
    )
    .max(30)
    .default([]),
});

export const certificationSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().trim().min(2, "Name is required").max(200),
  issuer: z.string().trim().min(1, "Issuer is required").max(160),
  date: z.string().trim().min(1, "Date is required").max(40),
  credentialId: z
    .string()
    .trim()
    .max(120)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .default(null),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
