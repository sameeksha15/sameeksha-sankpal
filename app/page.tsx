import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import IntroSplash from "@/components/home/IntroSplash";
import CollapseCanvas from "@/components/home/CollapseCanvas";
import { SHELL } from "@/lib/layout";
import { absoluteUrl, site } from "@/lib/site";

// Structured data identifying the site's owner. `sameAs` is what lets a search
// engine connect this page to the LinkedIn and GitHub profiles it already
// associates with the name.
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: absoluteUrl("/"),
  sameAs: [site.linkedin.url, site.github.url],
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "Vivekanand Education Society's Institute of Technology",
  },
  knowsAbout: ["Quantum computing", "Machine learning", "Differential privacy"],
};

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col overflow-hidden">
      <script
        type="application/ld+json"
        // Escaping "<" keeps the JSON from ever closing the script tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(person).replace(/</g, "\\u003c"),
        }}
      />
      <IntroSplash />
      <Header />
      <main className={`${SHELL} flex flex-1 flex-col px-5 sm:px-11`}>
        <FadeUp className="pt-[26px] text-center">
          <div className="font-mono text-xs font-medium tracking-[.22em] text-gold">
            &#10216;{" "}
            <span className="pointer-coarse:hidden">MOVE YOUR CURSOR</span>
            <span className="hidden pointer-coarse:inline">TAP A WORD</span>{" "}
            TO MEASURE &#10217;
          </div>
        </FadeUp>
        <CollapseCanvas />
      </main>
      <Footer />
    </div>
  );
}
