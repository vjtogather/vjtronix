"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { RoleName } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

const taxonomySchema = z.object({ id: z.string().optional(), name: z.string().trim().min(1).max(100), slug: z.string().trim().max(120).optional(), description: z.string().trim().max(500).optional() });
const idSchema = z.object({ id: z.string().min(1) });
function slugify(value: string) { return value.toLowerCase().trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
async function actor() { return (await requireRole([RoleName.ADMIN, RoleName.SUPER_ADMIN])).user.id; }
function refreshTags() { revalidatePath("/admin/blog"); revalidatePath("/admin/blog/new"); revalidatePath("/admin/blog/tags"); }
export async function saveTag(formData: FormData) { const parsed = taxonomySchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const actorId = await actor(); const data = { name: parsed.data.name, slug: slugify(parsed.data.slug || parsed.data.name) }; try { const tag = parsed.data.id ? await prisma.tag.update({ where: { id: parsed.data.id }, data }) : await prisma.tag.create({ data }); await prisma.auditLog.create({ data: { actorId, event: parsed.data.id ? "CMS_TAG_UPDATED" : "CMS_TAG_CREATED", metadata: { tagId: tag.id } } }); refreshTags(); } catch { return; } }
export async function deleteTag(formData: FormData) { const parsed = idSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const actorId = await actor(); await prisma.$transaction([prisma.tag.delete({ where: { id: parsed.data.id } }), prisma.auditLog.create({ data: { actorId, event: "CMS_TAG_DELETED", metadata: { tagId: parsed.data.id } } })]); refreshTags(); }
