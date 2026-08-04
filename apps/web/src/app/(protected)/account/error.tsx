"use client";

export default function AccountError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  void error;

  return (
    <div className="grid min-h-80 place-items-center p-5 sm:p-8 lg:p-10">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-white">Unable to load your account</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Please try again. Your account information has not been changed.</p>
        <button className="mt-6 rounded-lg bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950" onClick={reset} type="button">Try again</button>
      </div>
    </div>
  );
}
