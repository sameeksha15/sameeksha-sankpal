"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import FadeUp from "@/components/FadeUp";

// The last line of the splash finishes fading in at about 1.25s, so this
// leaves roughly three seconds to read it and reach for the button.
const AUTO_DISMISS_MS = 4200;

/** Full-screen "OBSERVE" overlay; fades out on click or after a few seconds. */
export default function IntroSplash() {
  const [gone, setGone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dismissedRef = useRef(false);

  useEffect(() => {
    const dismiss = () => {
      if (dismissedRef.current || !overlayRef.current) return;
      dismissedRef.current = true;
      overlayRef.current.style.pointerEvents = "none";
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.9,
        ease: "power1.inOut",
        onComplete: () => setGone(true),
      });
    };
    overlayRef.current?.addEventListener("click", dismiss);
    const timer = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, []);

  if (gone) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink p-10 text-center text-cream"
    >
      <FadeUp as="h1">
        <span className="font-serif text-[clamp(48px,8vw,104px)] leading-none tracking-[-.02em]">
          Sameeksha Sankpal
        </span>
      </FadeUp>
      <FadeUp delay={0.15} className="mt-6">
        <span className="font-mono text-xs font-medium tracking-[.22em] text-stone">
          THIS PAGE IS IN SUPERPOSITION UNTIL YOU LOOK
        </span>
      </FadeUp>
      <FadeUp delay={0.3} className="mt-[42px]">
        <button
          type="button"
          className="cursor-pointer whitespace-nowrap rounded-full border border-gold/50 bg-transparent px-8 py-[14px] font-mono text-[13px] font-medium tracking-[.16em] text-gold transition-colors duration-300 hover:bg-gold hover:text-ink"
        >
          &#9656;&nbsp;&nbsp;OBSERVE
        </button>
      </FadeUp>
      <FadeUp delay={0.45} className="mt-[22px]">
        <span className="font-mono text-[11px] tracking-[.12em] text-faint">
          or wait a moment
        </span>
      </FadeUp>
    </div>
  );
}
