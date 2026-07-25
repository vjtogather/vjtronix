"use server";

import { Prisma, RoleName } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { cmsBlogSchema } from "@/lib/validations/cms-blog";

type Result = { success: boolean; message: string; id?: string };
const slugify = (value: string) => value.toLowerCase().trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const cleanHtml = (value: string) => value.replace(/<\/?(script|style)[^>]*>/gi, "").replace(/\son\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
const minutes = (value: string) => Math.max(1, Math.ceil(value.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length / 200));
const refresh = (id?: string) => { revalidatePath("/admin/blog"); revalidatePath("/admin/blog/new"); if (id) revalidatePath(`/admin/blog/${id}`); };

export async function saveBlog(input: unknown, id?: string): Promise<Result> {
  const session = await requireRole([RoleName.ADMIN, RoleName.SUPER_ADMIN]); const parsed = cmsBlogSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Please review the blog fields." };
  const value = parsed.data; const subCategory = await prisma.subCategory.findFirst({ where: { id: value.subCategoryId, categoryId: value.categoryId }, select: { id: true } });
  if (!subCategory) return { success: false, message: "Select a subcategory belonging to the selected category." };
  const slug = slugify(value.slug || value.title); if (!slug) return { success: false, message: "Enter a title that can be used as a slug." };
  const content = cleanHtml(value.content); const data = { ...value, slug, content, readingTime: minutes(content), excerpt: value.excerpt || null, thumbnail: value.thumbnail || null, banner: value.banner || null, seoTitle: value.seoTitle || null, seoDescription: value.seoDescription || null };
  try { const blog = id ? await prisma.blog.update({ where: { id }, data }) : await prisma.blog.create({ data: { ...data, authorId: session.user.id } }); await prisma.auditLog.create({ data: { actorId: session.user.id, event: id ? "CMS_BLOG_UPDATED" : "CMS_BLOG_CREATED", metadata: { blogId: blog.id, published: blog.published } } }); refresh(blog.id); return { success: true, message: id ? "Blog updated." : "Blog created.", id: blog.id }; } catch (cause) { return { success: false, message: cause instanceof Prisma.PrismaClientKnownRequestError && cause.code === "P2002" ? "A blog with this slug already exists." : "Unable to save the blog." }; }
}

export async function deleteBlog(id: string): Promise<Result> { const session = await requireRole([RoleName.ADMIN, RoleName.SUPER_ADMIN]); try { await prisma.$transaction([prisma.blog.delete({ where: { id } }), prisma.auditLog.create({ data: { actorId: session.user.id, event: "CMS_BLOG_DELETED", metadata: { blogId: id } } })]); refresh(); return { success: true, message: "Blog deleted." }; } catch { return { success: false, message: "Unable to delete the blog." }; } }
export async function toggleBlogPublished(id: string, published: boolean): Promise<Result> { const session = await requireRole([RoleName.ADMIN, RoleName.SUPER_ADMIN]); try { await prisma.blog.update({ where: { id }, data: { published } }); await prisma.auditLog.create({ data: { actorId: session.user.id, event: "CMS_BLOG_PUBLICATION_UPDATED", metadata: { blogId: id, published } } }); refresh(id); return { success: true, message: published ? "Blog published." : "Blog moved to draft." }; } catch { return { success: false, message: "Unable to update publication status." }; } }
