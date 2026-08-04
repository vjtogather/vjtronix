import type { Metadata } from "next";
import { BadgeCheck, Link2, Mail, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/authorization";
import { ProfileForms } from "@/app/(protected)/account/profile/profile-forms";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { createdAt: true, emailVerified: true, image: true, name: true, password: true, phone: true },
  });
  const accounts = await prisma.account.findMany({ where: { userId: session.user.id, provider: { in: ["google", "github"] } }, select: { provider: true } }).catch(() => []);
  return (
    <div className="space-y-6 p-5 sm:p-8 lg:p-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-300">Account</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Your profile</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Your identity and access details for VJtronix.</p>
      </div>

      <ProfileForms hasPassword={Boolean(user?.password)} user={{ email: session.user.email || null, image: user?.image || session.user.image || null, name: user?.name || session.user.name || null, phone: user?.phone || null }} />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile details</CardTitle><CardDescription>Information associated with your account.</CardDescription></CardHeader>
          <CardContent className="space-y-5">
            <Detail icon={Mail} label="Email address" value={session.user.email || "Not available"} />
            <Detail icon={BadgeCheck} label="Email status" value={user?.emailVerified ? "Verified" : "Not verified"} />
            <Detail icon={ShieldCheck} label="Member since" value={user ? new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(user.createdAt) : "Unavailable"} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Access</CardTitle><CardDescription>Roles assigned to your VJtronix account.</CardDescription></CardHeader>
          <CardContent>
            {session.user.roles.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.025] p-6 text-center text-sm text-slate-500">No roles have been assigned to this account.</div>
            ) : (
              <ul className="space-y-3">
                {session.user.roles.map((role) => <li className="flex items-center gap-3 rounded-lg bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200" key={role}><ShieldCheck className="size-4 text-sky-300" aria-hidden="true" />{role.replaceAll("_", " ")}</li>)}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Connected providers</CardTitle><CardDescription>Sign-in providers currently linked to this account.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {(["google", "github"] as const).map((provider) => {
              const connected = accounts.some((account) => account.provider === provider);
              return <div className="flex items-center justify-between rounded-lg bg-white/[0.04] px-4 py-3" key={provider}><div className="flex items-center gap-3"><Link2 className="size-4 text-sky-300" aria-hidden="true" /><span className="text-sm font-medium capitalize text-slate-200">{provider}</span></div><span className={connected ? "text-xs font-medium text-emerald-200" : "text-xs text-slate-500"}>{connected ? "Connected" : "Not connected"}</span></div>;
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return <div className="flex items-start gap-3"><span className="mt-0.5 grid size-8 place-items-center rounded-md bg-sky-300/10 text-sky-200"><Icon className="size-4" aria-hidden="true" /></span><div><p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-sm text-slate-200">{value}</p></div></div>;
}
