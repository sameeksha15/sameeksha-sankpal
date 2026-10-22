import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import { projects } from "@/lib/projects";
import { SHELL } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Things I have built, from research code to small tools, each with a short write-up.",
};

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`${SHELL} flex-1 px-5 pt-[30px] pb-[70px] sm:px-11`}>
        <FadeUp>
          <div className="font-mono text-xs font-medium tracking-[.22em] text-gold">
            &#10216; 03 &middot; THE EVIDENCE &#10217;
          </div>
        </FadeUp>
        <FadeUp delay={0.05}>
          <h1 className="mt-[14px] font-serif text-[clamp(44px,7vw,64px)] italic leading-[1.05] tracking-[-.015em]">
            Projects
          </h1>
        </FadeUp>
        <FadeUp delay={0.08}>
          <p className="mt-5 font-serif text-[17px] leading-[1.7] text-khaki">
            Things I have built, from research code to small tools. Each one
            links to the code and a short write-up.
          </p>
        </FadeUp>

        <FadeUp delay={0.12} className="mt-[50px]">
          {projects.map((p, i) => {
            const repo = p.links?.find((l) => l.label === "GitHub");
            return (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className={`group grid items-baseline gap-4 border-t border-gold/12 py-[34px] no-underline md:grid-cols-[150px_1fr_auto] md:gap-9 ${
                  i === projects.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="font-mono text-xs font-medium tracking-[.1em] text-gold">
                  {p.kicker}
                  {p.dates && (
                    <>
                      <br />
                      <span className="font-normal text-faint">{p.dates}</span>
                    </>
                  )}
                </div>
                <div>
                  <div className="font-serif text-[24px] text-cream transition-colors duration-300 group-hover:text-gold sm:text-[27px]">
                    {p.title}
                  </div>
                  <p className="mt-3 max-w-[600px] font-serif text-base leading-[1.75] text-khaki">
                    {p.summary}
                  </p>
                  {repo && (
                    <span className="mt-3 inline-block font-mono text-[11px] tracking-[.12em] text-taupe">
                      GitHub &#8599;
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs leading-loose text-faint md:text-right">
                  {p.tags.map((tag) => (
                    <span key={tag} className="mr-3 md:mr-0 md:block">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </FadeUp>
      </main>
      <Footer />
    </div>
  );
}
