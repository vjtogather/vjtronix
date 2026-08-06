"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import { signOutAccount } from "@/app/(protected)/account/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/profile", label: "Profile", icon: UserRound },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

interface AccountNavigationProps {
  user: {
    email?: string | null;
    image?: string | null;
    name?: string | null;
  };
}

function getInitials(name?: string | null, email?: string | null) {
  const value = name || email || "VJ";

  return value
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AccountNavigation({ user }: AccountNavigationProps) {
  const pathname = usePathname();
  const initials = getInitials(user.name, user.email);

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950/80 p-4 lg:flex lg:flex-col">
        <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Your account
        </p>
        <nav aria-label="Account navigation" className="mt-4 grid gap-1">
          <NavigationLinks pathname={pathname} />
        </nav>
        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar size="lg">
              {user.image ? <AvatarImage alt="" src={user.image} /> : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user.name || "MicroHelp member"}</p>
              <p className="truncate text-xs text-slate-500">{user.email || "No email address"}</p>
            </div>
          </div>
          <form action={signOutAccount} className="mt-2">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300" type="submit">
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <nav aria-label="Account navigation" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-white/10 bg-slate-950/95 px-2 py-2 backdrop-blur lg:hidden">
        <NavigationLinks pathname={pathname} compact />
      </nav>
    </>
  );
}

function NavigationLinks({ compact = false, pathname }: { compact?: boolean; pathname: string }) {
  return navigation.map(({ href, icon: Icon, label }) => {
    const isActive = href === "/account" ? pathname === href : pathname.startsWith(href);

    return (
      <Link
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300",
          compact && "flex-col gap-1 px-1 py-1.5 text-xs",
          isActive
            ? "bg-sky-300/10 text-sky-200"
            : "text-slate-400 hover:bg-white/[0.06] hover:text-white",
        )}
        href={href}
        key={href}
      >
        <Icon className="size-4" aria-hidden="true" />
        {label}
      </Link>
    );
  });
}
