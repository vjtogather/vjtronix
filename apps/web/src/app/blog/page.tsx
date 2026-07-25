import type { Metadata } from "next";

import { BlogCard } from "@/components/blog/blog-card";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { SiteShell } from "@/components/layout/SiteShell";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Blog", description: "Embedded systems tutorials, engineering notes, and practical VJtronix articles.", alternates: { canonical: "/blog" } };
export const revalidate = 300;
const pageSize = 9;

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string; page?: string; search?: string }> }) {
  const params = await searchParams; const search = params.search?.trim() || ""; const category = params.category?.trim() || ""; const page = Math.max(1, Number(params.page) || 1);
  const where = { published: true, ...(category ? { category: { slug: category } } : {}), ...(search ? { OR: [{ title: { contains: search, mode: "insensitive" as const } }, { excerpt: { contains: search, mode: "insensitive" as const } }, { content: { contains: search, mode: "insensitive" as const } }] } : {}) };
  const [total, blogs, categories, recent, featured] = await Promise.all([prisma.blog.count({ where }), prisma.blog.findMany({ where, orderBy: [{ featured: "desc" }, { updatedAt: "desc" }], skip: (page - 1) * pageSize, take: pageSize, select: { title: true, slug: true, excerpt: true, thumbnail: true, featured: true, readingTime: true, updatedAt: true, author: { select: { name: true } }, category: { select: { name: true, slug: true } }, subCategory: { select: { name: true, slug: true } } } }), prisma.category.findMany({ where: { status: "ACTIVE" }, orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true, name: true, slug: true, _count: { select: { blogs: { where: { published: true } } } } } }), prisma.blog.findMany({ where: { published: true }, orderBy: { updatedAt: "desc" }, take: 5, select: { title: true, slug: true, updatedAt: true } }), prisma.blog.findMany({ where: { published: true, featured: true }, orderBy: { updatedAt: "desc" }, take: 4, select: { title: true, slug: true, updatedAt: true } })]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return <SiteShell><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><header className="max-w-3xl"><p className="text-sm font-semibold tracking-[.16em] text-sky-600 uppercase dark:text-sky-300">VJtronix journal</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Embedded engineering, explained clearly.</h1><p className="mt-4 text-lg leading-8 text-muted-foreground">Practical guides, project notes, and deep dives for engineers building with hardware and software.</p></header><div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem]"><div>{blogs.length ? <><div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{blogs.map((blog) => <BlogCard blog={blog} key={blog.slug} />)}</div><div className="mt-8"><BlogPagination page={page} searchParams={{ search, category }} totalPages={totalPages} /></div></> : <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed text-center"><div><p className="font-semibold">No published articles found</p><p className="mt-2 text-sm text-muted-foreground">Try a different search or category.</p></div></div>}</div><BlogSidebar categories={categories} featured={featured} recent={recent} search={search} /></div></div></SiteShell>;
}
