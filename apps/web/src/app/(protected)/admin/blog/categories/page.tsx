import type { Metadata } from "next";
import Link from "next/link";

import { CategoryTable } from "@/app/(protected)/admin/blog/categories/category-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Categories", robots: { index: false, follow: false } };

const pageSize = 10;
type SearchParams = { page?: string; search?: string; status?: string };

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const status = Object.values(CategoryStatus).find((value) => value === params.status);
  const page = Math.max(1, Number(params.page) || 1);
  const where: Prisma.CategoryWhereInput = {
    ...(status ? { status } : {}),
    ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { slug: { contains: search, mode: "insensitive" } }] } : {}),
  };
  const [total, categories] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, name: true, slug: true, icon: true, banner: true, description: true, seoTitle: true, seoDescription: true, status: true, order: true, createdAt: true, updatedAt: true, _count: { select: { posts: true, blogs: true } } },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6 p-5 sm:p-8 lg:p-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link className="text-sm font-medium text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200" href="/admin/blog">← Back to blogs</Link>
          <p className="mt-5 text-sm font-semibold tracking-[0.16em] text-sky-600 uppercase dark:text-sky-300">Content</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Categories</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Organize VJtronix content with searchable, SEO-ready categories.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category library</CardTitle>
          <CardDescription>{total} categor{total === 1 ? "y" : "ies"} matching the current filters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem_auto]" method="get">
            <input className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" defaultValue={search} name="search" placeholder="Search name or slug" />
            <select className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm" defaultValue={status || ""} name="status"><option value="">All statuses</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select>
            <button className="h-8 rounded-lg border border-input px-3 text-sm font-medium transition hover:bg-muted" type="submit">Filter</button>
          </form>
          <CategoryTable
  categories={categories.map((category) => ({
    ...category,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
    postCount: category._count.posts + category._count.blogs,
  }))}
/>

{categories.length === 0 && <EmptyState />}
          {totalPages > 1 ? <Pagination page={page} search={search} status={status} totalPages={totalPages} /> : null}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return <div className="grid min-h-56 place-items-center rounded-xl border border-dashed p-8 text-center"><div><p className="font-medium text-foreground">No categories found</p><p className="mt-2 text-sm text-muted-foreground">Create a category or adjust the current filters.</p></div></div>;
}

function Pagination({ page, search, status, totalPages }: { page: number; search: string; status?: CategoryStatus; totalPages: number }) {
  const href = (nextPage: number) => {
    const query = new URLSearchParams({ page: String(nextPage) });
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    return `/admin/blog/categories?${query}`;
  };
  return <div className="flex items-center justify-between border-t pt-5 text-sm"><p className="text-muted-foreground">Page {page} of {totalPages}</p><div className="flex gap-2">{page > 1 ? <Link className="rounded-lg border px-3 py-1.5 font-medium hover:bg-muted" href={href(page - 1)}>Previous</Link> : null}{page < totalPages ? <Link className="rounded-lg border px-3 py-1.5 font-medium hover:bg-muted" href={href(page + 1)}>Next</Link> : null}</div></div>;
}
