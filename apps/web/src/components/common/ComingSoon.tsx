import type { LucideIcon } from "lucide-react";
import { ArrowLeft, BellRing, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

import { SITE } from "@/constants/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ComingSoonProps = {
  title: string;
  description: string;
  features: readonly string[];
  illustration: LucideIcon;
  productName: string;
};

/**
 * A reusable launch-state page for VJtronix products that are still in development.
 */
export function ComingSoon({
  title,
  description,
  features,
  illustration: Illustration,
  productName,
}: ComingSoonProps) {
  const notifyHref = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `Notify me when ${productName} launches`,
  )}`;

  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.16),transparent_62%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.22),transparent_62%)]"
      />
      <div className="mx-auto grid min-h-[calc(100vh-8.5rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-sm font-medium text-sky-700 dark:text-sky-200">
            <Sparkles className="size-4" aria-hidden="true" />
            Building the future of embedded engineering
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {description}
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-2" aria-label={`${productName} planned features`}>
            {features.map((feature) => (
              <li className="flex items-center gap-2.5 text-sm font-medium text-foreground" key={feature}>
                <CheckCircle2 className="size-5 shrink-0 text-sky-500" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <a className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 shadow-lg shadow-sky-500/20")} href={notifyHref}>
              <BellRing className="size-4" aria-hidden="true" />
              Notify Me
            </a>
            <Link className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5")} href="/">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Home
            </Link>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-lg items-center justify-center lg:max-w-none">
          <div aria-hidden="true" className="absolute size-72 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/20 sm:size-96" />
          <div className="animate-coming-soon-float relative grid aspect-square w-full max-w-sm place-items-center overflow-hidden rounded-[2rem] border border-sky-500/20 bg-gradient-to-br from-sky-500/15 via-card to-violet-500/10 p-8 shadow-2xl shadow-sky-950/10 sm:max-w-md">
            <div aria-hidden="true" className="absolute inset-5 rounded-[1.5rem] border border-dashed border-sky-500/25" />
            <div aria-hidden="true" className="absolute left-0 top-1/2 h-px w-full bg-sky-500/15" />
            <div aria-hidden="true" className="absolute left-1/2 top-0 h-full w-px bg-sky-500/15" />
            <div className="relative grid size-28 place-items-center rounded-3xl border border-sky-400/30 bg-sky-500/15 text-sky-600 shadow-xl shadow-sky-500/15 dark:text-sky-200 sm:size-36">
              <Illustration className="size-14 sm:size-16" strokeWidth={1.4} aria-hidden="true" />
            </div>
            <span className="absolute bottom-9 rounded-full border border-sky-500/20 bg-background/80 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-sky-700 uppercase backdrop-blur dark:text-sky-200">
              VJtronix Lab
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
