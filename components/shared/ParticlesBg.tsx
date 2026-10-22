"use client";

import { useEffect, useRef } from "react";

const COUNT = 90;

/** Full-viewport canvas of faint gold particles drifting slowly downward. */
export default function ParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    const fit = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: 0.06 + Math.random() * 0.34,
      r: 0.4 + Math.random() * 1.1,
    }));

    let t = 0;
    let raf = 0;
    const draw = () => {
      t += 0.0022;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const yy = (p.y + t * p.s) % 1;
        ctx.beginPath();
        ctx.arc(p.x * w, yy * h, p.r, 0, 6.283);
        ctx.fillStyle = "rgba(216,168,84,0.09)";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
