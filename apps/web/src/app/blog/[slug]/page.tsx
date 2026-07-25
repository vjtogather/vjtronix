import type { Metadata } from "next";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog/blog-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { Badge } from "@/components/ui/badge";
import { SiteShell } from "@/components/layout/SiteShell";
import { SITE } from "@/constants/site";
import { prisma } from "@/lib/prisma";

export const revalidate = 300;

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({ where: { published: true }, select: { slug: true }, take: 500 });
  return blogs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findFirst({ where: { slug, published: true }, select: { title: true, excerpt: true, seoTitle: true, seoDescription: true, banner: true, thumbnail: true, updatedAt: true } });
  if (!blog) return { title: "Article not found", robots: { index: false, follow: false } };
  const title = blog.seoTitle || blog.title; const description = blog.seoDescription || blog.excerpt || SITE.description; const image = blog.banner || blog.thumbnail;
  return { title, description, alternates: { canonical: `/blog/${slug}` }, openGraph: { type: "article", title, description, url: `/blog/${slug}`, publishedTime: blog.updatedAt.toISOString(), images: image ? [{ url: image }] : undefined }, twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : undefined } };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const blog = await prisma.blog.findFirst({
    where: { slug, published: true },
    include: {
      author: { select: { name: true } },
      category: { select: { id: true, name: true, slug: true } },
      subCategory: { select: { name: true, slug: true } },
    },
  });

  if (!blog) notFound();

  const [categories, recent, featured, related, navigation] = await Promise.all([
    prisma.category.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { blogs: { where: { published: true } } } },
      },
    }),
    prisma.blog.findMany({
      where: { published: true, id: { not: blog.id } },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { title: true, slug: true, updatedAt: true },
    }),
    prisma.blog.findMany({
      where: { published: true, featured: true, id: { not: blog.id } },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: { title: true, slug: true, updatedAt: true },
    }),
    prisma.blog.findMany({
      where: { published: true, categoryId: blog.categoryId, id: { not: blog.id } },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        thumbnail: true,
        featured: true,
        readingTime: true,
        updatedAt: true,
        author: { select: { name: true } },
        category: { select: { name: true, slug: true } },
        subCategory: { select: { name: true, slug: true } },
      },
    }),
    prisma.blog.findMany({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
      select: { slug: true, title: true, updatedAt: true },
    }),
  ]);

  const index = navigation.findIndex((item) => item.slug === blog.slug);
  const previous = index < navigation.length - 1 ? navigation[index + 1] : null;
  const next = index > 0 ? navigation[index - 1] : null;

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <article>
            <nav className="mb-6 text-sm text-muted-foreground">
              <Link className="hover:text-foreground" href="/blog">
                Blog
              </Link>
              <span className="mx-2">/</span>
              <Link className="hover:text-foreground" href={`/blog?category=${blog.category.slug}`}>
                {blog.category.name}
              </Link>
              <span className="mx-2">/</span>
              <span>{blog.subCategory.name}</span>
            </nav>

            <header className="max-w-4xl">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{blog.category.name}</Badge>
                <Badge variant="outline">{blog.subCategory.name}</Badge>
                {blog.featured ? <Badge className="bg-sky-500 text-white">Featured</Badge> : null}
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{blog.title}</h1>

              {blog.excerpt ? <p className="mt-5 text-lg leading-8 text-muted-foreground">{blog.excerpt}</p> : null}

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <UserRound className="size-4" />
                  {blog.author.name || "VJtronix"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4" />
                  {formatDate(blog.updatedAt)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="size-4" />
                  {blog.readingTime} min read
                </span>
              </div>
            </header>

            {blog.banner ? (
              <div className="relative mt-10 aspect-[2/1] overflow-hidden rounded-2xl border">
                <Image alt="" className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 75vw" src={blog.banner} unoptimized />
              </div>
            ) : null}

            <div
              className="prose prose-slate mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-sky-600 dark:prose-a:text-sky-300"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <nav className="mt-12 grid gap-4 border-y py-6 sm:grid-cols-2">
              {previous ? <ArticleLink direction="Previous article" icon={ChevronLeft} item={previous} /> : <span />}
              {next ? <ArticleLink direction="Next article" icon={ChevronRight} item={next} reverse /> : null}
            </nav>

            {related.length ? (
              <section className="mt-12">
                <h2 className="text-2xl font-semibold">Related articles</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {related.map((item) => <BlogCard blog={item} key={item.slug} />)}
                </div>
              </section>
            ) : null}
          </article>

          <BlogSidebar categories={categories} featured={featured} recent={recent} />
        </div>
      </div>
    </SiteShell>
  );
}

function ArticleLink({ direction, icon: Icon, item, reverse = false }: { direction: string; icon: typeof ChevronLeft; item: { slug: string; title: string }; reverse?: boolean }) { return <Link className={`group rounded-xl p-3 transition hover:bg-muted ${reverse ? "text-right" : ""}`} href={`/blog/${item.slug}`}><span className={`flex items-center gap-1 text-xs text-muted-foreground ${reverse ? "justify-end" : ""}`}>{!reverse ? <Icon className="size-3.5" /> : null}{direction}{reverse ? <Icon className="size-3.5" /> : null}</span><span className="mt-2 block font-medium group-hover:text-sky-600 dark:group-hover:text-sky-300">{item.title}</span></Link>; }
function formatDate(date: Date) { return new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(date); }
