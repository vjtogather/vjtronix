"use server";

import { Prisma, RoleName } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { subCategoryIdSchema, subCategorySchema } from "@/lib/validations/subcategory";

type Result = { success: boolean; message: string };
const slugify = (value: string) => value.toLowerCase().trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const refresh = () => { revalidatePath("/admin/blog"); revalidatePath("/admin/blog/new"); revalidatePath("/admin/blog/subcategories"); };
const actor = async () => (await requireRole([RoleName.ADMIN, RoleName.SUPER_ADMIN])).user.id;
const error = (value: unknown): Result => value instanceof Prisma.PrismaClientKnownRequestError && value.code === "P2002" ? { success: false, message: "A subcategory with this name or slug already exists in the selected category." } : { success: false, message: "Unable to save the subcategory." };

export async function saveSubCategory(formData: FormData): Promise<Result> {
  const values = Object.fromEntries(formData); const parsed = subCategorySchema.safeParse(values); const id = typeof values.id === "string" ? values.id : undefined;
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Please review the form." };
  const actorId = await actor(); const { slug, ...data } = parsed.data; const payload = { ...data, slug: slugify(slug || data.name), icon: data.icon || null, description: data.description || null };
  try { const record = id ? await prisma.subCategory.update({ where: { id }, data: payload }) : await prisma.subCategory.create({ data: payload }); await prisma.auditLog.create({ data: { actorId, event: id ? "CMS_SUBCATEGORY_UPDATED" : "CMS_SUBCATEGORY_CREATED", metadata: { subCategoryId: record.id } } }); refresh(); return { success: true, message: id ? "Subcategory updated." : "Subcategory created." }; } catch (cause) { return error(cause); }
}

export async function deleteSubCategory(id: string): Promise<Result> {
  if (!subCategoryIdSchema.safeParse({ id }).success) return { success: false, message: "Invalid subcategory." };
  const actorId = await actor(); try { await prisma.$transaction([prisma.subCategory.delete({ where: { id } }), prisma.auditLog.create({ data: { actorId, event: "CMS_SUBCATEGORY_DELETED", metadata: { subCategoryId: id } } })]); refresh(); return { success: true, message: "Subcategory deleted." }; } catch (cause) { return error(cause); }
}

export async function toggleSubCategoryStatus(id: string, status: "ACTIVE" | "INACTIVE"): Promise<Result> {
  if (!subCategoryIdSchema.safeParse({ id }).success) return { success: false, message: "Invalid subcategory." };
  const actorId = await actor(); try { await prisma.$transaction([prisma.subCategory.update({ where: { id }, data: { status } }), prisma.auditLog.create({ data: { actorId, event: "CMS_SUBCATEGORY_STATUS_UPDATED", metadata: { subCategoryId: id, status } } })]); refresh(); return { success: true, message: `Subcategory ${status === "ACTIVE" ? "activated" : "deactivated"}.` }; } catch (cause) { return error(cause); }
}
