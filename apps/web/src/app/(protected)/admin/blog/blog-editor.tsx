"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveBlog } from "@/app/(protected)/admin/blog/cms-actions";
import { Button } from "@/components/ui/button";
import type { CmsBlogInput } from "@/lib/validations/cms-blog";

type Category = { id: string; name: string };
type SubCategory = { id: string; name: string; categoryId: string };
type EditorValues = CmsBlogInput & { id?: string };

export function BlogEditor({ blog, categories, subCategories }: { blog?: EditorValues; categories: Category[]; subCategories: SubCategory[] }) {
  const [pending, startTransition] = useTransition(); const [preview, setPreview] = useState(false);
  const form = useForm<EditorValues>({ defaultValues: blog ?? { title: "", slug: "", excerpt: "", content: "", thumbnail: "", banner: "", featured: false, published: false, categoryId: "", subCategoryId: "", seoTitle: "", seoDescription: "" } });
  const categoryId = form.watch("categoryId"); const content = form.watch("content"); const availableSubCategories = useMemo(() => subCategories.filter((item) => item.categoryId === categoryId), [categoryId, subCategories]);
  useEffect(() => { if (form.getValues("subCategoryId") && !availableSubCategories.some((item) => item.id === form.getValues("subCategoryId"))) form.setValue("subCategoryId", ""); }, [availableSubCategories, form]);
  const submit = form.handleSubmit((values) => startTransition(async () => { const result = await saveBlog(values, blog?.id); if (result.success) toast.success(result.message); else toast.error(result.message); }));

  return <form className="space-y-6" onSubmit={submit}><div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]"><section className="space-y-5 rounded-xl border bg-card p-5"><Field label="Title"><input className="input" {...form.register("title", { required: true })} /></Field><Field label="Excerpt"><textarea className="input min-h-24" {...form.register("excerpt")} /></Field><Field label="Article content"><textarea className="input min-h-96 font-mono text-sm" placeholder="Write HTML or rich article content…" {...form.register("content", { required: true, minLength: 20 })} /></Field>{preview ? <article className="prose dark:prose-invert max-w-none rounded-xl border p-5" dangerouslySetInnerHTML={{ __html: content || "" }} /> : null}</section><aside className="space-y-5 rounded-xl border bg-card p-5"><Field label="Category"><select className="input" {...form.register("categoryId", { required: true })}><option value="">Select category</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Subcategory"><select className="input" disabled={!categoryId} {...form.register("subCategoryId", { required: true })}><option value="">Select subcategory</option>{availableSubCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Slug"><input className="input" placeholder="Generated from title" {...form.register("slug")} /></Field><Field label="Thumbnail URL"><input className="input" placeholder="https://…" type="url" {...form.register("thumbnail")} /></Field><Field label="Banner URL"><input className="input" placeholder="https://…" type="url" {...form.register("banner")} /></Field><label className="flex gap-2 text-sm"><input type="checkbox" {...form.register("featured")} /> Feature this blog</label><label className="flex gap-2 text-sm"><input type="checkbox" {...form.register("published")} /> Publish immediately</label><Button className="w-full" disabled={pending} type="submit">{pending ? "Saving…" : "Save blog"}</Button><Button className="w-full" onClick={() => setPreview((value) => !value)} type="button" variant="outline">{preview ? "Hide preview" : "Preview"}</Button></aside></div><section className="rounded-xl border bg-card p-5"><h2 className="font-semibold">SEO</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="SEO title"><input className="input" {...form.register("seoTitle")} /></Field><Field label="SEO description"><textarea className="input min-h-20" {...form.register("seoDescription")} /></Field></div><p className="mt-4 text-sm text-muted-foreground">Reading time and sanitized article content are calculated server-side. Image URL fields are upload placeholders ready for storage integration.</p></section></form>;
}
function Field({ children, label }: { children: React.ReactNode; label: string }) { return <label className="grid gap-1.5 text-sm font-medium"><span>{label}</span>{children}</label>; }
