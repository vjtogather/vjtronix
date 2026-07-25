import { z } from "zod";

const optionalUrl = z.string().trim().url().optional().or(z.literal(""));

export const courseSchema = z.object({
  title: z.string().trim().min(3).max(180), slug: z.string().trim().max(200).optional(),
  shortDescription: z.string().trim().min(10).max(500), description: z.string().trim().min(10).max(200_000),
  thumbnail: optionalUrl, categoryId: z.string().trim().optional().or(z.literal("")),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]), language: z.string().trim().min(2).max(60),
  duration: z.coerce.number().int().min(0).max(100_000), price: z.coerce.number().min(0).max(10_000_000),
  isFree: z.boolean(), status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
}).superRefine((value, ctx) => { if (!value.isFree && value.price <= 0) ctx.addIssue({ code: "custom", path: ["price"], message: "Paid courses require a price." }); });

export const moduleSchema = z.object({ title: z.string().trim().min(2).max(180), description: z.string().trim().max(5_000).optional().or(z.literal("")) });
export const lessonSchema = z.object({ title: z.string().trim().min(2).max(180), slug: z.string().trim().max(200).optional(), content: z.string().trim().min(1).max(200_000), videoUrl: optionalUrl, duration: z.coerce.number().int().min(0).max(100_000), isPreview: z.boolean() });
