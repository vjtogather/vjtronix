import { z } from "zod";

const optionalUrl = z.string().trim().max(2_048).optional().refine((value) => !value || /^https?:\/\//.test(value), "Use a valid http(s) URL.");

export const cmsBlogSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().trim().min(20).max(200_000),
  thumbnail: optionalUrl,
  banner: optionalUrl,
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  categoryId: z.string().min(1),
  subCategoryId: z.string().min(1),
  seoTitle: z.string().trim().max(60).optional(),
  seoDescription: z.string().trim().max(160).optional(),
});

export type CmsBlogInput = z.infer<typeof cmsBlogSchema>;
