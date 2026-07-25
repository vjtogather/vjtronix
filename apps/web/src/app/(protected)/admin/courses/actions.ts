"use server";

import { CourseLevel, CourseStatus, RoleName } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { courseSchema, lessonSchema, moduleSchema } from "@/lib/validations/course";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const roles = [RoleName.ADMIN, RoleName.SUPER_ADMIN];
const slugify = (value: string) => value.toLowerCase().trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const cleanHtml = (value: string) => value.replace(/<\/?(script|style)[^>]*>/gi, "").replace(/\son\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");

function refresh(courseId?: string) { revalidatePath("/admin/courses"); if (courseId) revalidatePath(`/admin/courses/${courseId}`); }

export async function saveCourse(input: unknown, id?: string) {
  const session = await requireRole(roles); const parsed = courseSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Review the highlighted course fields." };
  const value = parsed.data; const slug = slugify(value.slug || value.title); if (!slug) return { error: "Enter a valid title or slug." };
  const data = { title: value.title, slug, shortDescription: value.shortDescription, description: cleanHtml(value.description), thumbnail: value.thumbnail || null, categoryId: value.categoryId || null, level: value.level as CourseLevel, language: value.language, duration: value.duration, price: value.isFree ? 0 : value.price, isFree: value.isFree, status: value.status as CourseStatus };
  try {
    const course = id ? await prisma.course.update({ where: { id }, data, select: { id: true } }) : await prisma.course.create({ data: { ...data, createdById: session.user.id }, select: { id: true } });
    await prisma.auditLog.create({ data: { actorId: session.user.id, event: id ? "LMS_COURSE_UPDATED" : "LMS_COURSE_CREATED", metadata: { courseId: course.id, slug } } });
    refresh(course.id); if (!id) redirect(`/admin/courses/${course.id}`); return { id: course.id };
  } catch { return { error: "A course with this slug already exists." }; }
}

export async function deleteCourse(id: string) { const session = await requireRole(roles); await prisma.course.delete({ where: { id } }); await prisma.auditLog.create({ data: { actorId: session.user.id, event: "LMS_COURSE_DELETED", metadata: { courseId: id } } }); refresh(); redirect("/admin/courses"); }

export async function saveModule(courseId: string, input: unknown, id?: string) {
  const session = await requireRole(roles); const parsed = moduleSchema.safeParse(input); if (!parsed.success) return { error: "Module title is required." };
  const data = { title: parsed.data.title, description: parsed.data.description || null };
  const courseModule = id ? await prisma.courseModule.update({ where: { id }, data }) : await prisma.courseModule.create({ data: { ...data, courseId, order: (await prisma.courseModule.count({ where: { courseId } })) + 1 } });
  await prisma.auditLog.create({ data: { actorId: session.user.id, event: id ? "LMS_MODULE_UPDATED" : "LMS_MODULE_CREATED", metadata: { courseId, moduleId: courseModule.id } } }); refresh(courseId); return { id: courseModule.id };
}

export async function deleteModule(courseId: string, id: string) { const session = await requireRole(roles); await prisma.courseModule.delete({ where: { id } }); await prisma.auditLog.create({ data: { actorId: session.user.id, event: "LMS_MODULE_DELETED", metadata: { courseId, moduleId: id } } }); refresh(courseId); }

export async function saveLesson(courseId: string, moduleId: string, input: unknown, id?: string) {
  const session = await requireRole(roles); const parsed = lessonSchema.safeParse(input); if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Review the lesson fields." };
  const value = parsed.data; const slug = slugify(value.slug || value.title); if (!slug) return { error: "Enter a valid title or slug." };
  try { const data = { title: value.title, slug, content: cleanHtml(value.content), videoUrl: value.videoUrl || null, duration: value.duration, isPreview: value.isPreview }; const lesson = id ? await prisma.lesson.update({ where: { id }, data }) : await prisma.lesson.create({ data: { ...data, moduleId, order: (await prisma.lesson.count({ where: { moduleId } })) + 1 } }); await prisma.auditLog.create({ data: { actorId: session.user.id, event: id ? "LMS_LESSON_UPDATED" : "LMS_LESSON_CREATED", metadata: { courseId, moduleId, lessonId: lesson.id } } }); refresh(courseId); return { id: lesson.id }; } catch { return { error: "A lesson with this slug already exists in this module." }; }
}

export async function deleteLesson(courseId: string, id: string) { const session = await requireRole(roles); await prisma.lesson.delete({ where: { id } }); await prisma.auditLog.create({ data: { actorId: session.user.id, event: "LMS_LESSON_DELETED", metadata: { courseId, lessonId: id } } }); refresh(courseId); }

async function reorder(model: "module" | "lesson", ids: string[]) {
  // Each record is moved through a distinct negative order before its final position.
  for (let index = 0; index < ids.length; index++) { if (model === "module") await prisma.courseModule.update({ where: { id: ids[index] }, data: { order: -(index + 1) } }); else await prisma.lesson.update({ where: { id: ids[index] }, data: { order: -(index + 1) } }); }
  for (let index = 0; index < ids.length; index++) { if (model === "module") await prisma.courseModule.update({ where: { id: ids[index] }, data: { order: index + 1 } }); else await prisma.lesson.update({ where: { id: ids[index] }, data: { order: index + 1 } }); }
}
export async function reorderModules(courseId: string, ids: string[]) { await requireRole(roles); await reorder("module", ids); refresh(courseId); }
export async function reorderLessons(courseId: string, moduleId: string, ids: string[]) { await requireRole(roles); await reorder("lesson", ids); refresh(courseId); }
