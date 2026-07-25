"use server";

import { revalidatePath } from "next/cache";
import { Prisma, RoleName } from "@/generated/prisma/client";

import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { categoryIdSchema, categorySchema, categoryStatusSchema } from "@/lib/validations/category";

type CategoryActionResult = { message: string; success: boolean };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formValues(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function refreshCategories() {
  revalidatePath("/admin/blog");
  revalidatePath("/admin/blog/categories");
  revalidatePath("/admin/blog/new");
}

function actionError(error: unknown): CategoryActionResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return { success: false, message: "A category with this name or slug already exists." };
  }

  return { success: false, message: "Unable to save the category. Please try again." };
}

async function getActorId() {
  return (await requireRole([RoleName.ADMIN, RoleName.SUPER_ADMIN])).user.id;
}

export async function createCategory(formData: FormData): Promise<CategoryActionResult> {
  const parsed = categorySchema.safeParse(formValues(formData));
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Please review the category details." };

  const actorId = await getActorId();
  const { slug, ...category } = parsed.data;

  try {
    const created = await prisma.category.create({ data: { ...category, slug: slugify(slug || category.name) } });
    await prisma.auditLog.create({ data: { actorId, event: "CMS_CATEGORY_CREATED", metadata: { categoryId: created.id } } });
    refreshCategories();
    return { success: true, message: "Category created." };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateCategory(formData: FormData): Promise<CategoryActionResult> {
  const id = categoryIdSchema.safeParse(formValues(formData));
  const parsed = categorySchema.safeParse(formValues(formData));
  if (!id.success || !parsed.success) return { success: false, message: parsed.error?.issues[0]?.message ?? "Please review the category details." };

  const actorId = await getActorId();
  const { slug, ...category } = parsed.data;

  try {
    await prisma.$transaction([
      prisma.category.update({ where: { id: id.data.id }, data: { ...category, slug: slugify(slug || category.name) } }),
      prisma.auditLog.create({ data: { actorId, event: "CMS_CATEGORY_UPDATED", metadata: { categoryId: id.data.id } } }),
    ]);
    refreshCategories();
    return { success: true, message: "Category updated." };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteCategory(id: string): Promise<CategoryActionResult> {
  const parsed = categoryIdSchema.safeParse({ id });
  if (!parsed.success) return { success: false, message: "Invalid category." };

  const actorId = await getActorId();
  try {
    await prisma.$transaction([
      prisma.category.delete({ where: { id: parsed.data.id } }),
      prisma.auditLog.create({ data: { actorId, event: "CMS_CATEGORY_DELETED", metadata: { categoryId: parsed.data.id } } }),
    ]);
    refreshCategories();
    return { success: true, message: "Category deleted." };
  } catch (error) {
    return actionError(error);
  }
}

export async function toggleCategoryStatus(id: string, status: "ACTIVE" | "INACTIVE"): Promise<CategoryActionResult> {
  const parsed = categoryStatusSchema.safeParse({ id, status });
  if (!parsed.success) return { success: false, message: "Invalid category status." };

  const actorId = await getActorId();
  try {
    await prisma.$transaction([
      prisma.category.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } }),
      prisma.auditLog.create({ data: { actorId, event: "CMS_CATEGORY_STATUS_UPDATED", metadata: parsed.data } }),
    ]);
    refreshCategories();
    return { success: true, message: `Category ${status === "ACTIVE" ? "activated" : "deactivated"}.` };
  } catch (error) {
    return actionError(error);
  }
}
