import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import ParticlesBg from "@/components/shared/ParticlesBg";
import CallScheduler from "@/components/contact/CallScheduler";
import { site, withBasePath } from "@/lib/site";
import { SHELL } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Email, LinkedIn, GitHub, resume, and a calendar for a short call.",
};

const links = [
  {
    label: site.email,
    href: `mailto:${site.email}`,
    meta: "EMAIL",
    arrow: "→",
    external: false,
    // Marked the way a paper marks the author who handles correspondence.
    corresponding: true,
  },
  {
    label: "LinkedIn",
    href: site.linkedin.url,
    meta: site.linkedin.handle,
    arrow: "→",
    external: true,
  },
  {
    label: "GitHub",
    href: site.github.url,
    meta: site.github.handle,
    arrow: "→",
    external: true,
  },
  {
    label: "Resume",
    href: withBasePath(site.resume),
    meta: "PDF",
    arrow: "↓",
    external: true,
  },
];

/**
 * A long address has one correct place to break, which is after the `@`, so
 * that is the only break offered rather than letting the domain split.
 */
function splitAtAt(label: string) {
  const at = label.indexOf("@");
  if (at === -1) return label;
  return (
    <>
      {label.slice(0, at + 1)}
      <wbr />
      {label.slice(at + 1)}
    </>
  );
}

export default function ContactPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <ParticlesBg />
      <div className="relative z-10">
        <Header />
      </div>
      <main className={`relative z-[1] ${SHELL} flex flex-1 flex-col px-5 pt-14 pb-5 sm:px-11`}>
        <FadeUp>
          <div className="font-mono text-xs font-medium tracking-[.22em] text-gold">
            &#10216; 05 &middot; CONTACT &#10217;
          </div>
        </FadeUp>
        <FadeUp delay={0.05}>
          <h1 className="mt-4 max-w-[840px] font-serif text-[clamp(48px,8vw,72px)] leading-[1.02] tracking-[-.02em]">
            Where to find me
          </h1>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="mt-6 font-serif text-[22px] leading-[1.6] text-parchment">
            You can reach me through any of the links below, or book a short
            call using the calendar further down.
          </p>
        </FadeUp>

        <FadeUp delay={0.16} className="mt-14">
          <div className="font-mono text-[11px] font-medium tracking-[.2em] text-gold">
            &#10216; CHANNELS &#10217;
          </div>
          <div className="mt-5 border-t border-cream/12">
            {links.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                className="group flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-cream/10 py-[26px] text-[#f3ead9] no-underline transition-[color,padding-left] duration-300 hover:pl-[10px] hover:text-gold-bright"
              >
                <span className="font-mono text-[12px] text-gold/55 tabular-nums">
                  [{i + 1}]
                </span>
                <span className="flex-1 font-serif text-[clamp(22px,4.5vw,34px)] break-words sm:break-normal">
                  {splitAtAt(link.label)}
                  {link.corresponding && (
                    <sup className="ml-[1px] align-super font-mono text-[0.38em] text-gold/70">
                      *
                    </sup>
                  )}
                </span>
                <span className="font-mono text-[13px] tracking-[.1em] text-taupe">
                  {link.meta}{" "}
                  <span className="inline-block -translate-x-1 opacity-40 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    {link.arrow}
                  </span>
                </span>
              </a>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11.5px] tracking-[.04em] text-faint">
            <span className="text-gold/70">*</span> correspondence should be
            addressed here
          </p>
        </FadeUp>

        <FadeUp delay={0.22} className="mt-24">
          <div className="font-mono text-[11px] font-medium tracking-[.2em] text-gold">
            &#10216; SCHEDULING &#10217;
          </div>
          <h2 className="mt-[14px] font-serif text-[clamp(30px,5vw,40px)] leading-[1.1] tracking-[-.015em]">
            Fifteen minutes
          </h2>
          <p className="mt-4 max-w-[580px] font-serif text-[17px] leading-[1.7] text-khaki">
            Pick a time that works for you.
          </p>
          <CallScheduler />
        </FadeUp>
      </main>
      <div className="relative z-10 mt-20">
        <Footer variant="timezone" />
      </div>
    </div>
  );
}
