import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import { SHELL } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Not found",
  description: "This state has zero amplitude.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`${SHELL} flex flex-1 flex-col justify-center px-5 pt-[30px] pb-[70px] sm:px-11`}>
        <FadeUp>
          <div className="font-mono text-xs font-medium tracking-[.22em] text-gold">
            &#10216; ERROR &middot; NO SUPPORT &#10217;
          </div>
        </FadeUp>
        <FadeUp delay={0.05}>
          <h1 className="mt-[14px] font-serif text-[clamp(44px,8vw,72px)] leading-[1.05] tracking-[-.02em]">
            &#10216;404|&psi;&#10217; = 0
          </h1>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="mt-6 max-w-[560px] font-serif text-[19px] leading-[1.8] text-parchment">
            This state has zero amplitude. Whatever you were looking for has no
            support in this wavefunction.
          </p>
        </FadeUp>
        <FadeUp delay={0.16}>
          <Link
            href="/"
            className="mt-10 inline-block font-mono text-[13px] font-medium tracking-[.14em] text-gold no-underline transition-colors hover:text-gold-bright"
          >
            &larr; BACK TO A STATE THAT EXISTS
          </Link>
        </FadeUp>
      </main>
      <Footer />
    </div>
  );
}
