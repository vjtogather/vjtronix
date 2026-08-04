import Link from "next/link";

import { NAVIGATION } from "@/constants/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/82 backdrop-blur-xl">
      <Container className="flex min-h-16 items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {NAVIGATION.map((item) => (
            <a
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
              href={item.href}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              target={item.isExternal ? "_blank" : undefined}
              key={item.href}
            >
              {item.title}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <Link href="/sign-in">
            <Button variant="ghost">
              Login
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="secondary">
              Sign Up
            </Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}
