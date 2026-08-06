import type { Metadata } from "next";
import Link from "next/link";

import { SignUpForm } from "@/app/(auth)/sign-up/sign-up-form";

export const metadata: Metadata = {
  title: "Create account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 py-12 text-slate-100">
      <section
        aria-labelledby="sign-up-title"
        className="w-full max-w-md rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-sky-950/30 sm:p-8"
      >
        <Link
          className="text-sm font-medium text-sky-200 transition hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
          href="/"
        >
          ← Back to MicroHelp
        </Link>
        <h1 className="mt-7 text-3xl font-semibold text-white" id="sign-up-title">
          Create your account
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Create an account to access your purchases and learning content.
        </p>
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link className="font-medium text-sky-200 hover:text-sky-100" href="/sign-in">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
