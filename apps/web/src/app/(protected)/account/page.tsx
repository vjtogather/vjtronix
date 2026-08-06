import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, CalendarDays, ShieldCheck, UsersRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/authorization";

export const metadata: Metadata = {
  title: "Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage() {
  const session = await requireUser();
  const [user, sessionCount, activityCount, activities] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { createdAt: true },
    }),
    optionalQuery(() => prisma.session.count({ where: { userId: session.user.id, expires: { gt: new Date() } } }), 0),
    optionalQuery(() => prisma.auditLog.count({ where: { actorId: session.user.id } }), 0),
    optionalQuery(() => prisma.auditLog.findMany({
      where: { actorId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, event: true, createdAt: true },
    }), []),
  ]);
  const name = session.user.name || "there";
  const initials = (session.user.name || session.user.email || "VJ")
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const joinedAt = user
    ? new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(user.createdAt)
    : "Unavailable";

  return (
    <div className="space-y-6 p-5 sm:p-8 lg:p-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-300">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Good to see you, {name}.</h1>
      </div>

      <Card className="overflow-hidden bg-gradient-to-br from-sky-400/15 via-slate-900 to-slate-900 ring-sky-300/20">
        <CardContent className="flex flex-col gap-6 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 text-xl" size="lg">
              {session.user.image ? <AvatarImage alt="" src={session.user.image} /> : null}
              <AvatarFallback className="bg-sky-300/15 text-sky-100">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-white">Your MicroHelp workspace</h2>
              <p className="mt-1 text-sm text-slate-300">Manage your profile and keep track of your activity in one place.</p>
            </div>
          </div>
          <Link className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-sky-300 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300" href="/account/profile">
            View profile <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </CardContent>
      </Card>

      <section aria-labelledby="statistics-title">
        <h2 className="sr-only" id="statistics-title">Account statistics</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={CalendarDays} label="Member since" value={joinedAt} />
          <StatCard icon={ShieldCheck} label="Account roles" value={String(session.user.roles.length)} />
          <StatCard icon={UsersRound} label="Active sessions" value={String(sessionCount)} />
          <StatCard icon={Activity} label="Recorded activity" value={String(activityCount)} />
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Your latest account events will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="grid min-h-44 place-items-center rounded-lg border border-dashed border-white/15 bg-white/[0.025] p-6 text-center">
              <div>
                <Activity className="mx-auto size-6 text-slate-500" aria-hidden="true" />
                <p className="mt-3 font-medium text-slate-200">No activity yet</p>
                <p className="mt-1 text-sm text-slate-500">Account events such as sign-ins will appear here.</p>
              </div>
            </div>
          ) : (
            <ol className="divide-y divide-white/10">
              {activities.map((activity) => (
                <li className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0" key={activity.id}>
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sky-300/10 text-sky-200"><Activity className="size-4" aria-hidden="true" /></span>
                    <p className="truncate text-sm font-medium text-slate-200">{formatEvent(activity.event)}</p>
                  </div>
                  <time className="shrink-0 text-xs text-slate-500" dateTime={activity.createdAt.toISOString()}>{formatDate(activity.createdAt)}</time>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) {
  return <Card><CardContent className="flex items-center gap-4 pt-4"><span className="grid size-10 place-items-center rounded-lg bg-sky-300/10 text-sky-200"><Icon className="size-5" aria-hidden="true" /></span><div><p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-xl font-semibold text-white">{value}</p></div></CardContent></Card>;
}

function formatEvent(event: string) { return event.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (character) => character.toUpperCase()); }
function formatDate(date: Date) { return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date); }

async function optionalQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}
