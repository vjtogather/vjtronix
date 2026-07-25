import { z } from "zod";

import { categoryStatuses } from "@/lib/validations/category";

export const subCategorySchema = z.object({
  categoryId: z.string().min(1, "Select a category."),
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().max(120).optional(),
  icon: z.string().trim().max(80).optional(),
  description: z.string().trim().max(500).optional(),
  order: z.coerce.number().int().min(0).max(100_000).default(0),
  status: z.enum(categoryStatuses),
});

export const subCategoryIdSchema = z.object({ id: z.string().min(1) });
export type SubCategoryInput = z.infer<typeof subCategorySchema>;
