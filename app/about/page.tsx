import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import ParticlesBg from "@/components/shared/ParticlesBg";
import { withBasePath } from "@/lib/site";
import { SHELL } from "@/lib/layout";

export const metadata: Metadata = {
  title: "About",
  description:
    "Final-year Information Technology student at VESIT, Mumbai, working on machine learning, privacy, and quantum machine learning.",
};

const education = {
  institution: "Vivekanand Education Society's Institute of Technology",
  degree: "Bachelor of Engineering, Information Technology",
  track: "Honours in Research",
  dates: "Aug 2023 – Present",
  cgpa: "9.87 / 10.00",
  location: "Mumbai, India",
};

/**
 * Posts held, on one time axis with the newest at the top, so time increases
 * upward, which is why the axis is capped with an arrow and labelled t.
 */
const experience = [
  {
    dates: "Dec 2025 – May 2026",
    title: "Research Intern",
    org: "Indian Institute of Technology Indore",
    body: "Synthetic text and speech for spoken language understanding, and a diagnosis of where synthetic-only training stops transferring to real audio.",
    href: "/research/spoken-language-understanding",
  },
  {
    dates: "Jun – Nov 2025",
    title: "Linux Kernel Bug Fixing Mentee",
    org: "The Linux Foundation",
    body: "Selected for the LFX kernel mentorship. Authored C patches to the I2C, DVB media and seccomp subsystems and carried them through maintainer review on LKML.",
    href: "/blog/lfx",
  },
  {
    dates: "Jun – Jul 2025",
    title: "Research Fellow",
    org: "Amity University",
    body: "An affective-state recognition pipeline built from physiological signals, with feature selection chosen for interpretability.",
    href: "/research/affective-computing",
  },
];

// Ordered by how central each group is to the work, not alphabetically.
const skills = [
  {
    group: "Machine learning",
    items: ["PyTorch", "TensorFlow", "scikit-learn", "Transformers", "NumPy", "Pandas"],
  },
  {
    group: "Privacy & evaluation",
    items: ["membership-inference auditing", "DP-GAN baselines", "differential privacy"],
  },
  { group: "Quantum", items: ["PennyLane", "Qiskit"] },
  { group: "Languages", items: ["Python", "C/C++", "SQL", "JavaScript", "LaTeX"] },
];

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <ParticlesBg />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className={`${SHELL} flex-1 px-5 pt-[30px] pb-[70px] sm:px-11`}>
          <FadeUp>
            <div className="font-mono text-xs font-medium tracking-[.22em] text-gold">
              &#10216; 01 &middot; THE PERSON &#10217;
            </div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h1 className="mt-[14px] font-serif text-[clamp(44px,7vw,64px)] italic leading-[1.05] tracking-[-.015em]">
              About
            </h1>
          </FadeUp>

          <FadeUp
            delay={0.1}
            className="mt-10 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_252px] md:gap-14"
          >
            <div>
              <p className="font-serif text-[19px] leading-[1.85] text-sand">
                I am Sameeksha Sankpal, a final-year Information Technology
                (Honours in Research) student at V.E.S. Institute of Technology,
                Mumbai. My work is mainly in quantum computing and machine
                learning. My broader technical background includes writing Linux
                kernel patches and experimenting with speech signals.
              </p>
              <p className="mt-[22px] font-serif text-[19px] leading-[1.85] text-sand">
                I use this space to document what I am learning and building
                along the way. I also enjoy writing about physics and explain
                complex topics simply on my blog.
              </p>
            </div>

            <figure className="order-first w-[168px] md:order-none md:w-full">
              {/* The portrait is bright against a dark page; the ring and the
                  soft inner edge stop it punching a hole in the layout. */}
              <div className="relative overflow-hidden rounded-lg border border-gold/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBasePath("/assets/sameeksha-sankpal.jpg")}
                  alt="Sameeksha Sankpal"
                  width={1186}
                  height={1134}
                  className="block aspect-square w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0_0_38px_rgba(21,18,14,0.5)]" />
              </div>
              <figcaption className="mt-3 font-mono text-[10.5px] tracking-[.08em] text-faint">
                Mumbai, India
              </figcaption>
            </figure>
          </FadeUp>

          {/* Education */}
          <FadeUp delay={0.14} className="mt-[74px]">
            <div className="font-mono text-xs font-medium tracking-[.22em] text-gold">
              &#10216; EDUCATION &#10217;
            </div>
            <div className="mt-6 rounded-lg border border-gold/18 bg-gold/3 px-6 py-6 sm:px-7">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 className="font-serif text-[21px] leading-[1.35] text-cream">
                  {education.institution}
                </h2>
                <span className="font-mono text-[11px] tracking-[.06em] whitespace-nowrap text-faint">
                  {education.dates}
                </span>
              </div>
              <p className="mt-2 font-serif text-[16.5px] leading-[1.6] text-khaki">
                {education.degree}
                <span className="text-faint"> &middot; {education.track}</span>
              </p>
              <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 border-t border-gold/12 pt-4 font-mono text-[11.5px] tracking-[.05em] text-faint">
                <span>
                  CGPA <span className="text-gold">{education.cgpa}</span>
                </span>
                <span>{education.location}</span>
              </div>
            </div>
          </FadeUp>

          {/* Experience, on a time axis */}
          <FadeUp delay={0.16} className="mt-[74px]">
            <div className="font-mono text-xs font-medium tracking-[.22em] text-gold">
              &#10216; EXPERIENCE &#10217;
            </div>

            <div className="mt-7">
              {/* Axis head: time increases upward, so the arrow points up. */}
              <div className="grid md:grid-cols-[142px_minmax(0,1fr)]">
                <div aria-hidden />
                <div className="relative h-7 border-l border-gold/15">
                  <span className="absolute -top-[5px] -left-[3.5px] h-0 w-0 border-x-[3.5px] border-b-[7px] border-x-transparent border-b-gold/45" />
                  <span className="absolute top-[-3px] left-[14px] font-serif text-[12px] italic text-gold/45">
                    t
                  </span>
                </div>
              </div>

              {experience.map((entry, i) => {
                const last = i === experience.length - 1;
                // An entry links either to a write-up on this site or out to
                // one published elsewhere; the arrow says which.
                const offsite = entry.href?.startsWith("http") ?? false;
                const inner = (
                  <>
                    <span className="absolute top-[9px] -left-[6px] h-px w-[11px] bg-gold" />
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-serif text-[20px] text-cream transition-colors duration-300 group-hover:text-gold">
                        {entry.title}
                      </span>
                      <span className="font-mono text-[11.5px] tracking-[.04em] text-gold/80">
                        {entry.org}
                      </span>
                    </div>
                    <p className="mt-2 max-w-[600px] font-serif text-[15.5px] leading-[1.7] text-khaki">
                      {entry.body}
                    </p>
                    {entry.href && (
                      <span className="mt-2 inline-block font-mono text-[10.5px] tracking-[.12em] text-taupe">
                        READ MORE{" "}
                        <span className="inline-block -translate-x-1 opacity-40 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                          {offsite ? "↗" : "→"}
                        </span>
                      </span>
                    )}
                  </>
                );
                const body = `group relative border-l border-gold/15 pl-7 ${
                  last ? "pb-1" : "pb-9"
                } no-underline block`;
                return (
                  <div
                    key={entry.title}
                    className="grid md:grid-cols-[142px_minmax(0,1fr)]"
                  >
                    <div className="mb-1 font-mono text-[11px] tracking-[.06em] text-faint md:mb-0 md:pt-[3px] md:pr-7 md:text-right">
                      {entry.dates}
                    </div>
                    {!entry.href ? (
                      <div className={body}>{inner}</div>
                    ) : offsite ? (
                      <a
                        href={entry.href}
                        target="_blank"
                        rel="noreferrer"
                        className={body}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link href={entry.href} className={body}>
                        {inner}
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Axis foot: the line stops, the way an axis does. */}
              <div className="grid md:grid-cols-[142px_minmax(0,1fr)]">
                <div aria-hidden />
                <div className="h-4 border-l border-gold/15" />
              </div>
            </div>
          </FadeUp>

          {/* Skills: a spec sheet rather than another row of boxes */}
          <FadeUp delay={0.18} className="mt-[74px]">
            <div className="font-mono text-xs font-medium tracking-[.22em] text-gold">
              &#10216; SKILLS &#10217;
            </div>
            <dl className="mt-7">
              {skills.map((s, i) => (
                <div
                  key={s.group}
                  className={`grid gap-x-8 gap-y-3 border-t border-gold/10 py-5 sm:grid-cols-[160px_minmax(0,1fr)] ${
                    i === skills.length - 1 ? "border-b" : ""
                  }`}
                >
                  <dt className="font-mono text-[10.5px] font-medium tracking-[.16em] text-faint uppercase sm:pt-[5px]">
                    {s.group}
                  </dt>
                  <dd className="flex flex-wrap gap-2">
                    {s.items.map((item) => (
                      <span
                        key={item}
                        className="rounded border border-gold/18 px-2 py-[3px] font-mono text-[11.5px] text-parchment transition-colors hover:border-gold/45 hover:text-cream"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeUp>
        </main>
        <Footer />
      </div>
    </div>
  );
}
