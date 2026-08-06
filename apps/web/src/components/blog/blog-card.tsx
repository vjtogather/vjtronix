import { CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export type PublicBlogCard = {
  author: { name: string | null };
  category: { name: string; slug: string };
  excerpt: string | null;
  featured: boolean;
  readingTime: number;
  slug: string;
  subCategory: { name: string; slug: string };
  thumbnail: string | null;
  title: string;
  updatedAt: Date;
};

export function BlogCard({ blog }: { blog: PublicBlogCard }) {
  return (
    <article className="group overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link className="relative block aspect-[16/9] overflow-hidden bg-gradient-to-br from-sky-500/20 to-violet-500/15" href={`/blog/${blog.slug}`}>
        {blog.thumbnail ? <Image alt="" className="object-cover transition duration-300 group-hover:scale-105" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src={blog.thumbnail} unoptimized /> : <span className="grid h-full place-items-center text-sm font-semibold text-sky-700 dark:text-sky-300">MicroHelp</span>}
        {blog.featured ? <Badge className="absolute top-3 left-3 bg-sky-500 text-white" variant="default">Featured</Badge> : null}
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-sky-700 dark:text-sky-300"><span>{blog.category.name}</span><span aria-hidden="true">/</span><span>{blog.subCategory.name}</span></div>
        <h2 className="mt-3 text-xl font-semibold tracking-tight"><Link className="transition hover:text-sky-600 dark:hover:text-sky-300" href={`/blog/${blog.slug}`}>{blog.title}</Link></h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{blog.excerpt || "Explore this MicroHelp engineering article."}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground"><span>By {blog.author.name || "MicroHelp"}</span><span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" />{formatDate(blog.updatedAt)}</span><span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" />{blog.readingTime} min read</span></div>
      </div>
    </article>
  );
}

function formatDate(date: Date) { return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date); }
