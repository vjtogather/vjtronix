import { Container } from "@/components/ui/Container";

const features = [
  {
    title: "Learning Platform",
    description:
      "Structured courses, resources, and documentation for embedded systems, firmware, electronics, programming, AI, and robotics.",
  },
  {
    title: "Content CMS",
    description:
      "A foundation for publishing technical blogs, project writeups, tutorials, and engineering notes with SEO-first pages.",
  },
  {
    title: "Builder Ecosystem",
    description:
      "Portfolio, GitHub integration, YouTube integration, digital products, analytics, and future AI assistant capabilities.",
  },
];

export function Features() {
  return (
    <section className="bg-slate-950 py-20 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase text-emerald-300">
            Product foundation
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            One ecosystem for practical technology education.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            MicroHelp is designed as a modular platform, so each feature can grow
            independently without turning the codebase into a monolith of
            unrelated pages.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              className="rounded-lg border border-white/10 bg-white/[0.035] p-6 transition hover:border-sky-300/30 hover:bg-white/[0.055]"
              key={feature.title}
            >
              <h3 className="text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
