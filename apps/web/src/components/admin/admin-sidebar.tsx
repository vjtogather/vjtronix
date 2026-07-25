"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ChevronDown,
  FileImage,
  FileText,
  FolderKanban,
  Image,
  LayoutDashboard,
  Settings,
  Tags,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type AdminNavigationGroup = {
  label?: string;
  items: Array<{
    href: string;
    icon: LucideIcon;
    label: string;
    superAdminOnly?: boolean;
  }>;
};

export const adminNavigation: readonly AdminNavigationGroup[] = [
  {
    items: [{ href: "/admin", icon: LayoutDashboard, label: "Dashboard" }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blog", icon: FileText, label: "Blogs" },
      { href: "/admin/blog/categories", icon: Tags, label: "Categories" },
      { href: "/admin/blog/subcategories", icon: Tags, label: "Sub Categories" },
    ],
  },
  {
    label: "Media",
    items: [
      { href: "/admin/media/images", icon: Image, label: "Images" },
      { href: "/admin/media/videos", icon: Video, label: "Videos" },
      { href: "/admin/media/documents", icon: FileImage, label: "Documents" },
    ],
  },
  {
    items: [
      { href: "/admin/projects", icon: FolderKanban, label: "Portfolio" },
      { href: "/admin/users", icon: Users, label: "Users" },
      { href: "/admin/audit-logs", icon: BarChart3, label: "Analytics" },
      { href: "/admin/permissions", icon: Settings, label: "Settings", superAdminOnly: true },
    ],
  },
] as const;

type AdminSidebarProps = {
  collapsed?: boolean;
  isSuperAdmin: boolean;
  onNavigate?: () => void;
};

export function AdminSidebar({ collapsed = false, isSuperAdmin, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="space-y-5">
      {adminNavigation.map((group, groupIndex) => {
        const items = group.items.filter((item) => !item.superAdminOnly || isSuperAdmin);

        return (
          <section key={group.label ?? groupIndex}>
            {group.label ? (
              <p className={cn("mb-2 px-3 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase", collapsed && "sr-only")}>
                {group.label}
              </p>
            ) : null}
            <div className="grid gap-1">
              {items.map(({ href, icon: Icon, label }) => {
                const active = href === "/admin" ? pathname === href : pathname.startsWith(href);

                return (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      collapsed && "justify-center px-2",
                      active
                        ? "bg-sky-500/12 text-sky-700 dark:text-sky-200"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    href={href}
                    key={`${label}-${href}`}
                    onClick={onNavigate}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className={cn("truncate", collapsed && "sr-only")}>{label}</span>
                    {label === "Blogs" && !collapsed ? <ChevronDown className="ml-auto size-4 text-muted-foreground" aria-hidden="true" /> : null}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </nav>
  );
}
