import type { Metadata } from "next";
import Link from "next/link";

import { signInWithEmail, signInWithProvider } from "@/app/(auth)/sign-in/actions";

export const metadata: Metadata = {
  title: "Sign in",
  robots: {
    index: false,
    follow: false,
  },
};

const errorMessages: Record<string, string> = {
  AccessDenied: "This account is not permitted to sign in.",
  Configuration: "Sign-in is temporarily unavailable. Please try again later.",
  CredentialsSignin: "Email or password is incorrect.",
  MissingCSRF: "Your sign-in request was blocked for security. Reload the page and try again.",
  EmailSignin: "Enter a valid email address to continue.",
  OAuthAccountNotLinked:
    "This email is already associated with a different sign-in method.",
  Verification: "This sign-in link is invalid or has expired.",
};

interface SignInPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : undefined;

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 py-12 text-slate-100">
      <section
        aria-labelledby="sign-in-title"
        className="w-full max-w-md rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-sky-950/30 sm:p-8"
      >
        <Link
          className="text-sm font-medium text-sky-200 transition hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
          href="/"
        >
          ← Back to VJtronix
        </Link>
        <h1 className="mt-7 text-3xl font-semibold text-white" id="sign-in-title">
          Sign in to VJtronix
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Continue with a trusted provider or sign in with your email and password.
        </p>

        {errorMessage ? (
          <p
            aria-live="polite"
            className="mt-6 rounded-md border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-7 grid gap-3">
          <form action={signInWithProvider.bind(null, "google")}>
            <button
              className="flex w-full items-center justify-center rounded-md border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
              type="submit"
            >
              Continue with Google
            </button>
          </form>
          <form action={signInWithProvider.bind(null, "github")}>
            <button
              className="flex w-full items-center justify-center rounded-md border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
              type="submit"
            >
              Continue with GitHub
            </button>
          </form>
        </div>

        <div className="my-7 flex items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            or
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form action={signInWithEmail} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="email">
              Email address
            </label>
            <input
              autoComplete="email"
              className="rounded-md border border-white/15 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="password">
              Password
            </label>
            <input
              autoComplete="current-password"
              className="rounded-md border border-white/15 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
              id="password"
              name="password"
              required
              type="password"
            />
          </div>
          <button
            className="rounded-md bg-sky-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
            type="submit"
          >
            Sign in with email
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          New to VJtronix?{" "}
          <Link className="font-medium text-sky-200 hover:text-sky-100" href="/sign-up">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
