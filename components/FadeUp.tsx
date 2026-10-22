"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Entrance animation used across every page: fade in while drifting up 14px,
 * staggered per element via `delay` (matches the design's fadeUp keyframe).
 */
export default function FadeUp({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(ref.current, {
      opacity: 0,
      y: 14,
      duration: 0.8,
      delay,
      ease: "power2.out",
    });
  });

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
