"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { site } from "@/lib/site";

const SECTIONS = [
  {
    id: "about",
    label: "About",
    href: "/about",
    italic: true,
    pos: [0.26, 0.44],
    desc: "The person behind the work.",
  },
  {
    id: "research",
    label: "Research",
    href: "/research",
    italic: false,
    pos: [0.5, 0.34],
    desc: "Quantum machine learning, differential privacy, and the uses of noise.",
  },
  {
    id: "projects",
    label: "Projects",
    href: "/projects",
    italic: true,
    pos: [0.73, 0.44],
    desc: "Things built to test an idea.",
  },
  {
    id: "blog",
    label: "Blog",
    href: "/blog",
    italic: false,
    pos: [0.48, 0.63],
    desc: "Notes and essays, thinking out loud.",
  },
] as const;

const PARTICLE_COUNT = 440;
const IDLE_MEASUREMENT =
  "⟨ψ⟩ = superposition of every version of me · move to measure";

// Blog sits close under Research on a short canvas, so the distribution can
// never get very peaked; the temperature and commit threshold are set from
// the probability actually reached when the cursor is on a word, not guessed.
const TEMP = 90; // softmax temperature, in px
const SMOOTH = 0.07; // temporal damping on the probabilities
const COMMIT = 0.58; // probability at which a section counts as measured
const IDLE_P = 1 / SECTIONS.length;

// Quantum Zeno effect: re-measure the same section this many times inside the
// window and its evolution freezes: a watched state never evolves.
const ZENO_REPEATS = 3;
const ZENO_WINDOW_MS = 2500;
const ZENO_THAW_MS = 2000;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * The homepage navigation. Four sections sit in superposition; the cursor
 * measures them.
 *
 * Each section's clarity is a continuous function of its own probability, and
 * the probabilities are damped over time. Nothing is ever selected discretely,
 * so there is no boundary for the state to flip across and no flicker. Moving
 * between two sections reads as both being partly present, which is what a
 * superposition actually looks like. A section is only "measured" once its
 * probability passes a threshold, and only then is it clickable.
 */
export default function CollapseCanvas() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const descRef = useRef<HTMLDivElement>(null);
  const measRef = useRef<HTMLDivElement>(null);
  // Latest measured section, read by the canvas click handler (−1 = none).
  const targetRef = useRef(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    console.log(
      "%c|ψ⟩ = α|visitor⟩ + β|collaborator⟩",
      "font-family:monospace;color:#d8a854;font-size:13px",
    );
    console.log(
      `%cYou looked. State collapsed. Say hi: ${site.email}`,
      "font-family:monospace;color:#9d937f;font-size:12px",
    );

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = canvas.clientWidth;
    let h = canvas.clientHeight;
    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(canvas);

    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      a: Math.random() * 6.283,
      r: Math.random(),
      sp: 0.12 + Math.random() * 0.6,
      home: i % SECTIONS.length,
      x: Math.random() * w,
      y: Math.random() * h,
    }));

    // Damped probabilities: the visual state actually rendered.
    const probs = SECTIONS.map(() => IDLE_P);

    let mx: number | null = null;
    let my: number | null = null;
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      mx = null;
      my = null;
    };
    const container = canvas.parentElement ?? canvas;
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    // Navigate to whatever section is currently measured, from anywhere on
    // the canvas; no need to move the cursor onto the word itself.
    const onCanvasClick = () => {
      if (targetRef.current >= 0) router.push(SECTIONS[targetRef.current].href);
    };
    canvas.addEventListener("click", onCanvasClick);

    let t = 0;
    let raf = 0;
    let prevCommitted = -1;
    let zenoTarget = -1;
    let zenoStamps: number[] = [];
    let zeno = false;
    let lastMeasuredAt = 0;

    const draw = () => {
      const anchors = SECTIONS.map((s) => [s.pos[0] * w, s.pos[1] * h]);

      // Keyboard focus measures the state exactly like cursor proximity does.
      const focusIdx = linkRefs.current.findIndex(
        (el) => el && el === document.activeElement,
      );

      // Target distribution for this frame.
      let want: number[];
      if (focusIdx >= 0) {
        want = SECTIONS.map((_, i) => (i === focusIdx ? 1 : 0));
      } else if (mx != null && my != null) {
        const cx = mx;
        const cy = my;
        const ex = anchors.map(([ax, ay]) =>
          Math.exp(-Math.hypot(cx - ax, cy - ay) / TEMP),
        );
        const sum = ex.reduce((a, b) => a + b, 0) || 1;
        want = ex.map((v) => v / sum);
      } else {
        want = SECTIONS.map(() => IDLE_P);
      }

      // Damping is what removes the jitter: a twitchy cursor can only nudge
      // the distribution, never snap it.
      for (let i = 0; i < probs.length; i++) {
        probs[i] = lerp(probs[i], want[i], SMOOTH);
      }

      let lead = 0;
      for (let i = 1; i < probs.length; i++) if (probs[i] > probs[lead]) lead = i;
      const leadP = probs[lead];
      const measured = leadP >= COMMIT;
      targetRef.current = measured ? lead : -1;
      canvas.style.cursor = measured ? "pointer" : "crosshair";

      // Each fresh measurement is one observation. Enough in quick succession
      // and the state stops evolving entirely.
      const now = performance.now();
      const committed = measured ? lead : -1;
      if (committed !== prevCommitted) {
        if (committed >= 0) {
          if (committed === zenoTarget) {
            zenoStamps = zenoStamps.filter((ts) => now - ts < ZENO_WINDOW_MS);
          } else {
            zenoTarget = committed;
            zenoStamps = [];
            zeno = false;
          }
          zenoStamps.push(now);
          lastMeasuredAt = now;
          if (zenoStamps.length >= ZENO_REPEATS) zeno = true;
        }
        prevCommitted = committed;
      }
      if (zeno && now - lastMeasuredAt > ZENO_THAW_MS) {
        zeno = false;
        zenoStamps = [];
      }
      const frozen = zeno && measured && lead === zenoTarget;
      if (!frozen) t += 0.01;

      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const amp = probs[p.home];
        // A cluster tightens and brightens as its own amplitude grows.
        const spread = 1 - 0.62 * amp;
        const [ax, ay] = anchors[p.home];
        const tx = ax + Math.cos(p.a + t * p.sp) * (46 + p.r * 112) * spread;
        const ty = ay + Math.sin(p.a + t * p.sp) * (32 + p.r * 82) * spread;
        p.x += (tx - p.x) * 0.045;
        p.y += (ty - p.y) * 0.045;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1 + 0.7 * amp, 0, 6.283);
        ctx.fillStyle = `rgba(216,168,84,${0.16 + 0.5 * amp})`;
        ctx.fill();
      }

      SECTIONS.forEach((s, i) => {
        const el = linkRefs.current[i];
        if (!el) return;
        const amp = probs[i];
        const arrow = el.querySelector<HTMLElement>("[data-arrow]");
        // Words hold their position; only their clarity changes. A gentle
        // drift keeps the field alive without moving anything far.
        const driftX = frozen ? 0 : Math.sin(t * 1.1 + i * 2) * 4 * (1 - amp);
        const driftY = frozen ? 0 : Math.cos(t * 0.9 + i * 2) * 4 * (1 - amp);
        el.style.opacity = String(Math.min(1, 0.2 + 1.05 * amp));
        el.style.filter = `blur(${(2.4 * Math.pow(1 - amp, 1.6)).toFixed(2)}px)`;
        el.style.transform =
          `translate(-50%,-50%) translate(${driftX.toFixed(2)}px,${driftY.toFixed(2)}px) ` +
          `scale(${(0.96 + 0.13 * amp).toFixed(3)})`;
        el.style.pointerEvents = measured && i === lead ? "auto" : "none";
        if (arrow) {
          arrow.style.opacity = String(smoothstep(COMMIT - 0.08, COMMIT + 0.1, amp));
        }
      });

      if (descRef.current && measRef.current) {
        // Fades in only once one section clearly leads, so the text never
        // swaps while it is legible.
        const show = smoothstep(0.45, 0.65, leadP);
        if (show > 0) descRef.current.textContent = SECTIONS[lead].desc;
        descRef.current.style.opacity = String(show);

        if (mx == null && focusIdx < 0) {
          measRef.current.textContent = IDLE_MEASUREMENT;
        } else if (frozen) {
          measRef.current.textContent = `⟨zeno⟩ = ${SECTIONS[lead].id}   ·   a watched state never evolves`;
        } else if (measured) {
          measRef.current.textContent = `⟨measured⟩ = ${SECTIONS[lead].id}`;
        } else {
          // Still in superposition: show the live amplitudes.
          const terms = probs
            .map((p, i) => ({ p, i }))
            .sort((a, b) => b.p - a.p)
            .slice(0, 2)
            .map((x) => `${x.p.toFixed(2)}|${SECTIONS[x.i].id}⟩`);
          measRef.current.textContent = `⟨ψ⟩ = ${terms.join(" + ")} + …`;
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("click", onCanvasClick);
    };
  }, [router]);

  return (
    <>
      <div className="relative mt-2 min-h-[480px] flex-1">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 block h-full w-full cursor-crosshair"
        />
        {SECTIONS.map((s, i) => (
          <Link
            key={s.id}
            href={s.href}
            ref={(el) => {
              linkRefs.current[i] = el;
            }}
            className="absolute whitespace-nowrap text-center text-[#f3ead9] no-underline"
            style={{
              left: `${s.pos[0] * 100}%`,
              top: `${s.pos[1] * 100}%`,
              transform: "translate(-50%,-50%)",
              // Only clarity transitions; position is driven per frame.
              transition: "opacity .45s ease, filter .45s ease",
            }}
          >
            <span
              className={`block font-serif text-[38px] sm:text-[54px] ${s.italic ? "italic" : ""}`}
            >
              {s.label}
            </span>
            <span
              data-arrow
              className="mt-2 block font-mono text-[11px] font-medium tracking-[.22em] text-gold opacity-0"
            >
              ENTER &rarr;
            </span>
          </Link>
        ))}
      </div>

      <div className="pb-5 text-center">
        {/* Every description is laid out invisibly in the same cell, so the box
            is always as tall as the longest one at the current width. A
            two-line description then never pushes the page down on hover. The
            visible one sits on the bottom line, so its gap to the line below
            stays the same whichever section is showing. */}
        <div className="mx-auto grid max-w-[600px] font-serif text-[22px] italic leading-[1.5] text-balance text-[#e6d9c2]">
          {SECTIONS.map((s) => (
            <span
              key={s.id}
              aria-hidden
              className="invisible col-start-1 row-start-1"
            >
              {s.desc}
            </span>
          ))}
          <div
            ref={descRef}
            className="col-start-1 row-start-1 self-end opacity-0"
          >
            &nbsp;
          </div>
        </div>
        <div
          ref={measRef}
          className="mt-4 font-mono text-[13px] tracking-[.05em] text-gold"
        >
          {IDLE_MEASUREMENT}
        </div>
      </div>
    </>
  );
}
