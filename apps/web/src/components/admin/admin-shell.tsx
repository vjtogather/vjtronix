"use client";

import { ChevronsLeft, ChevronsRight, LogOut, Menu, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { signOutAdmin } from "@/app/(protected)/admin/actions";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
  isSuperAdmin: boolean;
  user: { email?: string | null; image?: string | null; name?: string | null };
};

function getInitials(name?: string | null, email?: string | null) {
  return (name || email || "VJ")
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AdminShell({ children, isSuperAdmin, user }: AdminShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const initials = getInitials(user.name, user.email);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/75 lg:px-6">
        <Button className="lg:hidden" variant="ghost" size="icon" onClick={() => setIsMobileNavigationOpen(true)}>
          <Menu className="size-5" aria-hidden="true" />
          <span className="sr-only">Open navigation</span>
        </Button>
        <Logo />
        <div className="hidden h-6 w-px bg-border lg:block" aria-hidden="true" />
        <AdminBreadcrumbs />
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-200 sm:inline-flex">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {isSuperAdmin ? "Super Admin" : "Admin"}
          </span>
          <Avatar size="sm">
            {user.image ? <AvatarImage alt="" src={user.image} /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <form action={signOutAdmin}>
            <Button className="text-muted-foreground hover:text-foreground" variant="ghost" size="icon" type="submit">
              <LogOut className="size-4" aria-hidden="true" />
              <span className="sr-only">Sign out</span>
            </Button>
          </form>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className={cn("hidden shrink-0 border-r bg-card/35 p-3 transition-[width] duration-200 lg:block", isCollapsed ? "w-20" : "w-64")}>
          <div className={cn("mb-5 flex items-center", isCollapsed ? "justify-center" : "justify-between px-2")}>
            <p className={cn("text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase", isCollapsed && "sr-only")}>Workspace</p>
            <Button variant="ghost" size="icon-sm" onClick={() => setIsCollapsed((value) => !value)}>
              {isCollapsed ? <ChevronsRight className="size-4" aria-hidden="true" /> : <ChevronsLeft className="size-4" aria-hidden="true" />}
              <span className="sr-only">{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
            </Button>
          </div>
          <AdminSidebar collapsed={isCollapsed} isSuperAdmin={isSuperAdmin} />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <Sheet open={isMobileNavigationOpen} onOpenChange={setIsMobileNavigationOpen}>
        <SheetContent side="left" className="w-[min(19rem,85vw)] border-border p-0" showCloseButton>
          <SheetHeader className="border-b">
            <SheetTitle>VJtronix Admin</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <AdminSidebar isSuperAdmin={isSuperAdmin} onNavigate={() => setIsMobileNavigationOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
