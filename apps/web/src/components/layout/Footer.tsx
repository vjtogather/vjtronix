import { NAVIGATION } from "@/constants/navigation";
import { SITE } from "@/constants/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <Container className="grid gap-10 py-10 md:grid-cols-[1.2fr_1fr] md:py-14">
        {/* Left */}
        <div className="max-w-md">
          <Logo />
          <p className="mt-5 text-sm leading-6 text-slate-400">
            {SITE.description}
          </p>
        </div>

        {/* Right */}
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Platform */}
          <div>
            <h2 className="text-sm font-semibold text-white">Platform</h2>

            <ul className="mt-4 space-y-3">
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h2 className="text-sm font-semibold text-white">Connect</h2>

            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition hover:text-white"
                >
                  📧 Email
                </a>
              </li>

              <li>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  📱 WhatsApp
                </a>
              </li>

              <li>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  📸 Instagram
                </a>
              </li>

              <li>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  💼 LinkedIn
                </a>
              </li>

              <li>
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  💻 GitHub
                </a>
              </li>

              <li>
                <a
                  href={SITE.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  ▶️ YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <Container className="border-t border-white/10 py-6">
        <p className="text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {SITE.name}. All Rights Reserved.
          <br />
          Designed & Developed by <strong>{SITE.author}</strong>.
        </p>
      </Container>
    </footer>
  );
}