"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/site";
import { FRAME } from "@/lib/layout";

export default function Header() {
  const pathname = usePathname().replace(/\/+$/, "") || "/";

  return (
    <header className={`${FRAME} flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-6 sm:px-11 sm:py-[34px]`}>
      <Link
        href="/"
        className="font-serif text-[21px] font-medium tracking-[.01em] text-bright no-underline"
      >
        Sameeksha&nbsp;Sankpal
      </Link>
      <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs font-medium tracking-[.04em]">
        {navItems.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`no-underline transition-colors hover:text-cream ${
              pathname.startsWith(href) ? "text-gold" : "text-khaki"
            }`}
          >
            |{label}&#10217;
          </Link>
        ))}
      </nav>
    </header>
  );
}
