import { z } from "zod";

export const categoryStatuses = ["ACTIVE", "INACTIVE"] as const;

const optionalText = (maxLength: number) =>
  z.string().trim().max(maxLength).optional().transform((value) => value || undefined);

const optionalUrl = z
  .string()
  .trim()
  .max(2_048)
  .optional()
  .transform((value) => value || undefined)
  .refine((value) => !value || /^https?:\/\//.test(value), "Enter a valid http(s) URL.");

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100),
  slug: optionalText(120),
  icon: optionalText(80),
  banner: optionalUrl,
  description: optionalText(500),
  seoTitle: optionalText(60),
  seoDescription: optionalText(160),
  status: z.enum(categoryStatuses),
  order: z.coerce.number().int().min(0).max(100_000).default(0),
});

export const categoryIdSchema = z.object({ id: z.string().min(1) });

export const categoryStatusSchema = categoryIdSchema.extend({
  status: z.enum(categoryStatuses),
});

export type CategoryInput = z.infer<typeof categorySchema>;
