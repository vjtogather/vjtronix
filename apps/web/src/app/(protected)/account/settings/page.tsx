import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, ShieldCheck, UserRound } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/authorization";

export const metadata: Metadata = {
  title: "Account settings",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const session = await requireUser();

  return (
    <div className="space-y-6 p-5 sm:p-8 lg:p-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-300">Account</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Settings</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Review the security and sign-in options for your account.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile information</CardTitle><CardDescription>Your display name and account identity are managed in your profile.</CardDescription></CardHeader>
          <CardContent className="flex items-center justify-between gap-4 rounded-b-xl border-t border-white/10 bg-white/[0.025] py-4">
            <div className="flex min-w-0 items-center gap-3"><UserRound className="size-5 shrink-0 text-sky-300" aria-hidden="true" /><p className="truncate text-sm text-slate-300">{session.user.name || session.user.email || "MicroHelp member"}</p></div>
            <Link className="shrink-0 text-sm font-medium text-sky-200 hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300" href="/account/profile">View profile</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Sign-in security</CardTitle><CardDescription>Use a unique password and keep your connected provider account secure.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <SettingItem icon={KeyRound} title="Password authentication" description="Your email and password can be used to sign in securely." />
            <SettingItem icon={ShieldCheck} title="Connected providers" description="Google and GitHub sign-in remain available when linked to your account." />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Account status</CardTitle><CardDescription>Your account is active and ready to use.</CardDescription></CardHeader>
        <CardContent><div className="flex items-center gap-3 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100"><ShieldCheck className="size-4" aria-hidden="true" />Active account</div></CardContent>
      </Card>
    </div>
  );
}

function SettingItem({ description, icon: Icon, title }: { description: string; icon: typeof KeyRound; title: string }) {
  return <div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sky-300/10 text-sky-200"><Icon className="size-4" aria-hidden="true" /></span><div><h3 className="text-sm font-medium text-slate-200">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{description}</p></div></div>;
}
