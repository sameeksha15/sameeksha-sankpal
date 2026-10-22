import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import IntroSplash from "@/components/home/IntroSplash";
import CollapseCanvas from "@/components/home/CollapseCanvas";
import { SHELL } from "@/lib/layout";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <IntroSplash />
      <Header />
      <main className={`${SHELL} flex flex-1 flex-col px-5 sm:px-11`}>
        <FadeUp className="pt-[26px] text-center">
          <div className="font-mono text-xs font-medium tracking-[.22em] text-gold">
            &#10216; MOVE YOUR CURSOR TO MEASURE &#10217;
          </div>
        </FadeUp>
        <CollapseCanvas />
      </main>
      <Footer />
    </div>
  );
}
