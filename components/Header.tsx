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
      {/* Below md the links take a full-width row of their own, spread
          evenly, rather than wrapping a leftover link onto a separate line. */}
      <nav className="flex w-full justify-between font-mono text-[11px] font-medium md:w-auto md:justify-start md:gap-x-5 md:text-xs md:tracking-[.04em]">
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
