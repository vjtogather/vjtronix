import type { Metadata } from "next";
import { Activity, FileText, FolderKanban, Users } from "lucide-react";
import Link from "next/link";

import { DashboardStatCard } from "@/components/admin/dashboard/dashboard-stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [userCount, postCount, projectCount, weeklyEventCount, recentActivity, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.project.count(),
    prisma.auditLog.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        event: true,
        createdAt: true,
        actor: { select: { name: true, email: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, isActive: true },
    }),
  ]);

  return (
    <div className="space-y-8 p-5 sm:p-8 lg:p-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-sky-600 uppercase dark:text-sky-300">VJtronix workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">A focused view of your platform, content, and community activity.</p>
        </div>
        <Link className="text-sm font-medium text-sky-700 transition hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200" href="/admin/blog/new">
          Create a blog post →
        </Link>
      </div>

      <section aria-label="Platform overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard description="Registered platform members" href="/admin/users" icon={Users} label="Total users" value={userCount} />
        <DashboardStatCard description="Articles across all statuses" href="/admin/blog" icon={FileText} label="Blog posts" value={postCount} />
        <DashboardStatCard description="Projects in your portfolio" href="/admin/projects" icon={FolderKanban} label="Portfolio projects" value={projectCount} />
        <DashboardStatCard description="Recorded over the last 7 days" href="/admin/audit-logs" icon={Activity} label="Weekly activity" value={weeklyEventCount} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Latest platform events and administrative actions.</CardDescription>
            </div>
            <Link className="shrink-0 text-sm font-medium text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200" href="/admin/audit-logs">View all</Link>
          </CardHeader>
          <CardContent>
            {recentActivity.length ? (
              <ol className="divide-y">
                {recentActivity.map((entry) => (
                  <li className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0" key={entry.id}>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{formatEvent(entry.event)}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{entry.actor?.name || entry.actor?.email || "System"}</p>
                    </div>
                    <time className="shrink-0 text-xs text-muted-foreground" dateTime={entry.createdAt.toISOString()}>{formatDate(entry.createdAt)}</time>
                  </li>
                ))}
              </ol>
            ) : <EmptyState message="Activity will appear here as your team uses the platform." />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>New users</CardTitle>
              <CardDescription>Recently created accounts.</CardDescription>
            </div>
            <Link className="shrink-0 text-sm font-medium text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200" href="/admin/users">Manage</Link>
          </CardHeader>
          <CardContent>
            {recentUsers.length ? (
              <ul className="space-y-3">
                {recentUsers.map((user) => (
                  <li className="rounded-xl border bg-card p-3" key={user.id}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium text-foreground">{user.name || "Unnamed user"}</p>
                      <span className={user.isActive ? "text-xs font-medium text-emerald-600 dark:text-emerald-300" : "text-xs font-medium text-rose-600 dark:text-rose-300"}>{user.isActive ? "Active" : "Inactive"}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{user.email || "No email address"}</p>
                  </li>
                ))}
              </ul>
            ) : <EmptyState message="New member accounts will appear here." />}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="grid min-h-44 place-items-center rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">{message}</div>;
}

function formatEvent(event: string) {
  return event.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short" }).format(date);
}
