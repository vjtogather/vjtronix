"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bot, ClipboardList, FolderKanban, KeyRound, LayoutDashboard, ShieldCheck, ShoppingBag, Users } from "lucide-react";
import { FileText } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/blog", icon: FileText, label: "Blog" },
  { href: "/admin/courses", icon: BookOpen, label: "Courses" },
  { href: "/admin/projects", icon: FolderKanban, label: "Projects" },
  { href: "/admin/products", icon: ShoppingBag, label: "Products" },
  { href: "/admin/ai", icon: Bot, label: "AI assistant" },
  { href: "/admin/roles", icon: ShieldCheck, label: "Roles", superAdminOnly: true },
  { href: "/admin/permissions", icon: KeyRound, label: "Permissions", superAdminOnly: true },
  { href: "/admin/audit-logs", icon: ClipboardList, label: "Audit logs" },
];

export function AdminNavigation({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950/80 p-4 lg:block">
        <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Administration</p>
        <nav aria-label="Admin navigation" className="mt-4 grid gap-1"><NavigationLinks isSuperAdmin={isSuperAdmin} pathname={pathname} /></nav>
      </aside>
      <nav aria-label="Admin navigation" className="fixed inset-x-0 bottom-0 z-30 grid grid-flow-col auto-cols-fr border-t border-white/10 bg-slate-950/95 px-1 py-2 backdrop-blur lg:hidden"><NavigationLinks compact isSuperAdmin={isSuperAdmin} pathname={pathname} /></nav>
    </>
  );
}

function NavigationLinks({ compact = false, isSuperAdmin, pathname }: { compact?: boolean; isSuperAdmin: boolean; pathname: string }) {
  return items.filter((item) => !item.superAdminOnly || isSuperAdmin).map(({ href, icon: Icon, label }) => {
    const active = href === "/admin" ? pathname === href : pathname.startsWith(href);

    return <Link aria-current={active ? "page" : undefined} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300", compact && "flex-col gap-1 px-1 py-1.5 text-[10px]", active ? "bg-sky-300/10 text-sky-200" : "text-slate-400 hover:bg-white/[0.06] hover:text-white")} href={href} key={href}><Icon className="size-4" aria-hidden="true" />{label}</Link>;
  });
}
