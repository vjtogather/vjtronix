"use client";

import { Edit3, MoreHorizontal, Plus, Power, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { createCategory, deleteCategory, toggleCategoryStatus, updateCategory } from "@/app/(protected)/admin/blog/categories/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { CategoryStatus } from "@/generated/prisma/client";

type CategoryRow = {
  banner: string | null;
  createdAt: string;
  description: string | null;
  icon: string | null;
  id: string;
  name: string;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string;
  status: CategoryStatus;
  updatedAt: string;
  postCount: number;
  order: number;
};

type CategoryTableProps = {
  categories: CategoryRow[];
};

const emptyCategory = {
  banner: "",
  description: "",
  icon: "",
  name: "",
  order: 0,
  seoDescription: "",
  seoTitle: "",
  slug: "",
  status: "ACTIVE" as CategoryStatus,
};

export function CategoryTable({ categories }: CategoryTableProps) {
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);

  async function handleStatusToggle(category: CategoryRow) {
    setPendingStatusId(category.id);
    const nextStatus: CategoryStatus = category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const result = await toggleCategoryStatus(category.id, nextStatus);
    setPendingStatusId(null);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  async function handleDelete() {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    const result = await deleteCategory(categoryToDelete.id);
    setIsDeleting(false);
    if (result.success) {
      toast.success(result.message);
      setCategoryToDelete(null);
      return;
    }
    toast.error(result.message);
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Add category
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b bg-muted/45 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Slug</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Posts</th>
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((category) => (
              <tr className="transition-colors hover:bg-muted/35" key={category.id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <CategoryVisual category={category} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{category.name}</p>
                      <p className="mt-1 max-w-72 truncate text-xs text-muted-foreground">{category.description || "No description"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{category.slug}</td>
                <td className="px-5 py-4"><StatusBadge status={category.status} /></td>
                <td className="px-5 py-4 text-muted-foreground">{category.postCount}</td>
                <td className="px-5 py-4 text-xs text-muted-foreground">{formatDate(category.updatedAt)}</td>
                <td className="px-5 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${category.name}`} />}>
                      <MoreHorizontal className="size-4" aria-hidden="true" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                        <Edit3 className="size-4" aria-hidden="true" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled={pendingStatusId === category.id} onClick={() => void handleStatusToggle(category)}>
                        <Power className="size-4" aria-hidden="true" /> {category.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => setCategoryToDelete(category)}>
                        <Trash2 className="size-4" aria-hidden="true" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CategoryFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} title="Add category" description="Create a category for organizing VJtronix content." values={emptyCategory} onSubmit={createCategory} />
      <CategoryFormDialog open={Boolean(editingCategory)} onOpenChange={(open) => !open && setEditingCategory(null)} title="Edit category" description="Update category content, SEO details, and availability." values={editingCategory ?? emptyCategory} onSubmit={updateCategory} />

      <Dialog open={Boolean(categoryToDelete)} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <DialogContent showCloseButton={!isDeleting}>
          <DialogHeader>
            <DialogTitle>Delete category?</DialogTitle>
            <DialogDescription>
              This will permanently delete “{categoryToDelete?.name}”. Posts assigned to it will remain available but become uncategorized.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={isDeleting} onClick={() => setCategoryToDelete(null)}>Cancel</Button>
            <Button variant="destructive" disabled={isDeleting} onClick={() => void handleDelete()}>{isDeleting ? "Deleting…" : "Delete category"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CategoryFormDialog({ description, onOpenChange, onSubmit, open, title, values }: {
  description: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => Promise<{ message: string; success: boolean }>;
  open: boolean;
  title: string;
  values: typeof emptyCategory | CategoryRow;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(formData: FormData) {
    if ("id" in values) formData.set("id", values.id);
    setIsSubmitting(true);
    const result = await onSubmit(formData);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      onOpenChange(false);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-2xl overflow-y-auto" showCloseButton={!isSubmitting}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form action={submit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><Input defaultValue={values.name} name="name" placeholder="Embedded systems" required /></Field>
            <Field label="Slug"><Input defaultValue={values.slug} name="slug" placeholder="embedded-systems" /></Field>
            <Field label="Icon"><Input defaultValue={values.icon || ""} name="icon" placeholder="microchip" /></Field>
            <Field label="Display order"><Input defaultValue={values.order} min="0" name="order" type="number" /></Field>
            <Field label="Status"><select className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" defaultValue={values.status} name="status"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></Field>
          </div>
          <Field label="Banner URL"><Input defaultValue={values.banner || ""} name="banner" placeholder="https://example.com/category-banner.jpg" type="url" /></Field>
          <Field label="Description"><textarea className="min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" defaultValue={values.description || ""} name="description" placeholder="A short description for this category." /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="SEO title"><Input defaultValue={values.seoTitle || ""} name="seoTitle" placeholder="Up to 60 characters" /></Field>
            <Field label="SEO description"><Input defaultValue={values.seoDescription || ""} name="seoDescription" placeholder="Up to 160 characters" /></Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save category"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return <label className="grid gap-1.5 text-sm font-medium text-foreground"><span>{label}</span>{children}</label>;
}

function CategoryVisual({ category }: { category: CategoryRow }) {
  if (category.banner) {
    return <span aria-label={`${category.name} banner`} className="size-10 shrink-0 rounded-lg border bg-cover bg-center" role="img" style={{ backgroundImage: `url("${category.banner}")` }} />;
  }
  return <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sky-500/10 text-sm font-semibold text-sky-700 dark:text-sky-300">{category.icon?.slice(0, 2).toUpperCase() || category.name.slice(0, 2).toUpperCase()}</span>;
}

function StatusBadge({ status }: { status: CategoryStatus }) {
  return <span className={status === "ACTIVE" ? "rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300" : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"}>{status === "ACTIVE" ? "Active" : "Inactive"}</span>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}
