import { CourseEditor } from "../course-editor";
import { prisma } from "@/lib/prisma";
export default async function NewCoursePage() { const categories = await prisma.courseCategory.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }); return <div className="p-5 sm:p-8 lg:p-10"><h1 className="mb-6 text-3xl font-semibold text-white">New course</h1><CourseEditor categories={categories} /></div>; }
