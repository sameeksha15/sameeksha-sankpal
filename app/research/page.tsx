import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import { research } from "@/lib/research";
import { SHELL } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Quantum machine learning and differential privacy, including how noise affects learning and privacy.",
};

// Author lists carry her own name marked, the way an academic page sets them,
// so position in the list reads at a glance. Newest first.
const SELF = "Sameeksha S. Sankpal";

const publications = [
  {
    title:
      "The Generator or the Audit: Evaluation Design in Membership Inference on Synthetic Tabular Data",
    authors: [SELF, "Anushree Prabhu"],
    status: "Under review",
    venue: "5th IEEE Conference on Secure and Trustworthy Machine Learning",
    year: "2027",
    related: "/research/quantum-gans",
  },
  {
    title:
      "Does Quantum Attention Help Forecast Stock Volatility? A Matched Quantum-Classical Study",
    authors: [
      SELF,
      "Shifa Shaikh",
      "Shantanu Pawar",
      "Anushka Sharma",
      "Mannat Doultani",
      "Shardul Gore",
    ],
    status: "Under review",
    venue:
      "International Conference on Intelligent Networks and Data-driven Intelligent Applications",
    year: "2026",
    related: "/research/quantformer",
  },
  {
    title:
      "Beyond Naturalness: Diagnosing the Synthetic-to-Real Gap in Spoken Language Understanding",
    authors: [SELF, "Chandresh K. Maurya", "Rahul K. Dubey"],
    status: "Under review",
    venue: "Transactions on Machine Learning Research",
    year: "2026",
    related: "/research/spoken-language-understanding",
  },
  {
    title:
      "What Actually Improves Low-Resource ASR: Lessons from Thirty-Seven LoRA Adaptations Across Eight Border Languages",
    authors: ["Vishal Sharma", "Chandresh K. Maurya", SELF],
    status: "Under review",
    venue: "22nd International Conference on Natural Language Processing",
    year: "2026",
  },
];

export default function ResearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`${SHELL} flex-1 px-5 pt-[30px] pb-[70px] sm:px-11`}>
        <FadeUp>
          <div className="font-mono text-xs font-medium tracking-[.22em] text-gold">
            &#10216; 02 &middot; THE QUESTIONS &#10217;
          </div>
        </FadeUp>
        <FadeUp delay={0.05}>
          <h1 className="mt-[14px] font-serif text-[clamp(44px,7vw,64px)] leading-[1.05] tracking-[-.015em]">
            Research
          </h1>
        </FadeUp>
        <FadeUp delay={0.08}>
          <p className="mt-5 font-serif text-[17px] leading-[1.7] text-khaki">
            I work on quantum machine learning and differential privacy,
            including how noise affects learning and privacy. Papers,
            preprints, and ongoing work are below.
          </p>
        </FadeUp>

        <FadeUp delay={0.12} className="mt-[50px]">
          {research.map((item, i) => (
            <Link
              key={item.slug}
              href={`/research/${item.slug}`}
              className={`group grid gap-4 border-t border-gold/12 py-[34px] no-underline md:grid-cols-[200px_1fr] md:gap-9 ${
 i === research.length - 1 ? "border-b" : ""
 }`}
            >
              <div className="font-mono text-[13px] leading-[1.7] text-stone">
                {item.dates}
                <br />
                <span className="text-faint">{item.venue?.toUpperCase()}</span>
              </div>
              <div>
                <div className="font-mono text-[11px] font-medium tracking-[.16em] text-gold">
                  {item.kicker}
                </div>
                <div className="mt-[10px] font-serif text-[22px] text-cream transition-colors duration-300 group-hover:text-gold sm:text-2xl">
                  {item.title}
                </div>
                <p className="mt-3 max-w-[640px] font-serif text-base leading-[1.75] text-khaki">
                  {item.summary}
                </p>
                <span className="mt-3 inline-block font-mono text-[11px] tracking-[.12em] text-taupe">
                  READ MORE{" "}
                  <span className="inline-block -translate-x-1 opacity-40 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    &rarr;
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </FadeUp>

        <FadeUp delay={0.2} className="mt-[70px]">
          <div className="font-mono text-xs font-medium tracking-[.22em] text-gold">
            &#10216; PUBLICATIONS &#10217;
          </div>
          <ol className="mt-6">
            {publications.map((p, i) => (
              <li
                key={p.title}
                className={`grid gap-x-5 border-t border-gold/10 py-6 sm:grid-cols-[34px_minmax(0,1fr)] ${
 i === publications.length - 1 ? "border-b" : ""
 }`}
              >
                {/* Numbered newest first, so [1] is the most recent */}
                <span className="font-mono text-[11px] text-gold/70 sm:pt-[6px]">
                  [{i + 1}]
                </span>
                <div>
                  <div className="font-serif text-[18px] leading-[1.45] text-cream">
                    {p.title}
                  </div>
                  <div className="mt-2 font-serif text-[15px] leading-[1.6] text-taupe">
                    {p.authors.map((a, j) => (
                      <span key={a}>
                        {j > 0 && ", "}
                        <span className={a === SELF ? "text-cream" : undefined}>
                          {a}
                        </span>
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 font-serif text-[15px] leading-[1.6] text-khaki">
                    <em className="italic">{p.venue}</em>, {p.year}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="rounded border border-gold/30 px-2 py-[3px] font-mono text-[10.5px] tracking-[.08em] text-gold">
                      {p.status}
                    </span>
                    {p.related && (
                      <Link
                        href={p.related}
                        className="group font-mono text-[10.5px] tracking-[.1em] text-taupe no-underline transition-colors hover:text-gold"
                      >
                        THE WORK BEHIND IT{" "}
                        <span className="inline-block -translate-x-1 opacity-40 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                          &rarr;
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </FadeUp>
      </main>
      <Footer />
    </div>
  );
}
