import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";

const metrics = [
  { label: "Core domains", value: "8+" },
  { label: "Product modules", value: "10" },
  { label: "Built for scale", value: "1k+" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.16),transparent_32%),linear-gradient(225deg,rgba(52,211,153,0.13),transparent_30%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
      <Container className="relative grid min-h-[calc(100vh-4rem)] items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-sm font-medium text-sky-200">
            Embedded Systems · Firmware · Linux · IoT
          </p>
          <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Learn Embedded.
            <br />
            Build the Future.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Master Embedded Systems, Firmware, Linux, IoT, Robotics and C
            Programming through practical projects and industry-focused learning.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/courses">
              <Button>Start Learning</Button>
            </Link>
            <Link href="/projects">
              <Button variant="secondary">Explore Projects</Button>
            </Link>
          </div>
          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <div
                className="border-l border-white/10 pl-4"
                key={metric.label}
              >
                <dt className="text-xs font-medium uppercase text-slate-500">
                  {metric.label}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-white">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-sky-950/30">
            <div className="rounded-md border border-white/10 bg-slate-950">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="size-2.5 rounded-full bg-rose-400" />
                <span className="size-2.5 rounded-full bg-amber-300" />
                <span className="size-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs text-slate-500">
                  microhelp-platform.ts
                </span>
              </div>
              <div className="space-y-5 p-5 font-mono text-sm leading-7 text-slate-300">
                <p>
                  <span className="text-sky-300">const</span>{" "}
                  platform = {"{"}
                </p>
                <p className="pl-5">
                  modules: [
                  <span className="text-emerald-300">&quot;Blog&quot;</span>,{" "}
                  <span className="text-emerald-300">&quot;LMS&quot;</span>,{" "}
                  <span className="text-emerald-300">&quot;Shop&quot;</span>],
                </p>
                <p className="pl-5">
                  audience:{" "}
                  <span className="text-emerald-300">
                    &quot;engineers and builders&quot;
                  </span>
                  ,
                </p>
                <p className="pl-5">
                  stack: [
                  <span className="text-emerald-300">&quot;Next.js&quot;</span>,{" "}
                  <span className="text-emerald-300">&quot;NestJS&quot;</span>,{" "}
                  <span className="text-emerald-300">
                    &quot;PostgreSQL&quot;
                  </span>
                  ],
                </p>
                <p>{"};"}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
