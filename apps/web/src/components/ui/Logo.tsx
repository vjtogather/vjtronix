import Link from "next/link";
import Image from "next/image";

import { SITE } from "@/constants/site";

export function Logo() {
  return (
    <Link
      aria-label={`${SITE.name} home`}
      className="inline-flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
      href="/"
    >
      <Image
        alt={SITE.name}
        className="h-10 w-auto"
        height={40}
        priority
        src="/logo-dark.svg"
        width={178}
      />
    </Link>
  );
}
