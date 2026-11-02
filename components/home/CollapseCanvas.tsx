"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { site } from "@/lib/site";

// Positions are fractions of the field. Phones get their own arrangement:
// squeezed into a narrow field, the wide one packs Research against About and
// Projects, so there the words spread vertically instead.
const SECTIONS = [
  {
    id: "about",
    label: "About",
    href: "/about",
    italic: true,
    wide: [0.26, 0.44],
    narrow: [0.27, 0.46],
    desc: "The person behind the work.",
  },
  {
    id: "research",
    label: "Research",
    href: "/research",
    italic: false,
    wide: [0.5, 0.34],
    narrow: [0.5, 0.2],
    desc: "Quantum machine learning, differential privacy, and the uses of noise.",
  },
  {
    id: "projects",
    label: "Projects",
    href: "/projects",
    italic: true,
    wide: [0.73, 0.44],
    narrow: [0.73, 0.46],
    desc: "Things built to test an idea.",
  },
  {
    id: "blog",
    label: "Blog",
    href: "/blog",
    italic: false,
    wide: [0.48, 0.63],
    narrow: [0.5, 0.72],
    desc: "Notes and essays, thinking out loud.",
  },
] as const;

const PARTICLE_COUNT = 440;
const IDLE_MEASUREMENT = "⟨ψ⟩ = superposition of every version of me";

// The temperature and commit threshold are set from the probability actually
// reached with the pointer on a word, at the field width the layout was tuned
// for. Orbits and temperature both scale with the field, so a phone, where the
// words sit half as far apart, sees the same distribution rather than a
// flatter one that never crosses the threshold.
const TEMP = 90; // softmax temperature, in px at full width
const FULL_WIDTH = 800; // field width TEMP and the orbits were tuned at
const SMOOTH = 0.07; // temporal damping on the probabilities
const COMMIT = 0.58; // probability at which a section counts as measured
const IDLE_P = 1 / SECTIONS.length;

// Quantum Zeno effect: re-measure the same section this many times inside the
// window and its evolution freezes: a watched state never evolves.
const ZENO_REPEATS = 3;
const ZENO_WINDOW_MS = 2500;
const ZENO_THAW_MS = 2000;

// Touch: how far a finger may move and still count as a tap, and how close to
// a word a tap must land to measure it.
const TAP_SLOP = 10; // px
const TAP_REACH = 36; // px beyond the word's box

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}
const oneHot = (k: number) => SECTIONS.map((_, i) => (i === k ? 1 : 0));

/**
 * The homepage navigation. Four sections sit in superposition and the pointer
 * measures them.
 *
 * Each section's clarity is a continuous function of its own probability, and
 * the probabilities are damped over time. Nothing is ever selected discretely,
 * so there is no boundary for the state to flip across and no flicker. Moving
 * between two sections reads as both being partly present, which is what a
 * superposition actually looks like. A section is only "measured" once its
 * probability passes a threshold, and only then can it be entered.
 *
 * A mouse measures by proximity. A finger cannot hover, so touch measures in
 * the two ways a physicist would: held on the glass it stands in for the
 * cursor (continuous measurement), and a tap is a projective measurement that
 * leaves the state collapsed onto the word it hit. Measuring a collapsed state
 * again returns the same outcome with certainty, so a second tap on the same
 * word is what enters it.
 */
export default function CollapseCanvas() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const descRef = useRef<HTMLDivElement>(null);
  const measRef = useRef<HTMLDivElement>(null);
  // Latest measured section, read by the input handlers (−1 = none).
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
    let scale = 1;
    let anchors: [number, number][] = [];
    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      scale = Math.max(0.45, Math.min(1, w / FULL_WIDTH));
      // The words are placed by CSS, which switches layout at a breakpoint,
      // so the field reads their positions back rather than keeping a copy.
      anchors = linkRefs.current.map((el) =>
        el ? [el.offsetLeft, el.offsetTop] : [0, 0],
      );
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

    // Pointer position in field coordinates, while something is measuring.
    let mx: number | null = null;
    let my: number | null = null;
    let touch = false; // whether the latest input was a finger
    let pinned = -1; // section a tap or slide left collapsed
    let press: { x: number; y: number } | null = null; // finger currently down
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const track = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };

    // The word under a tap, judged by its box rather than its centre: a long
    // word like Research reaches nearer its neighbour's centre than its own.
    const sectionAt = (x: number, y: number) => {
      let hit = -1;
      let nearest = TAP_REACH;
      linkRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.hypot(
          Math.max(r.left - x, 0, x - r.right),
          Math.max(r.top - y, 0, y - r.bottom),
        );
        if (d < nearest) {
          hit = i;
          nearest = d;
        }
      });
      return hit;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      touch = e.pointerType !== "mouse";
      if (touch) press = { x: e.clientX, y: e.clientY };
      track(e);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      if (e.pointerType === "mouse") {
        touch = false;
        pinned = -1;
        track(e);
      } else if (press) {
        track(e); // a finger only measures while it is on the glass
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!e.isPrimary || !press) return;
      const slid =
        Math.hypot(e.clientX - press.x, e.clientY - press.y) > TAP_SLOP;
      press = null;
      mx = null;
      my = null;
      if (slid) {
        pinned = targetRef.current; // a slide leaves what it ended on measured
        return;
      }
      const hit = sectionAt(e.clientX, e.clientY);
      if (hit >= 0 && hit === pinned) {
        router.push(SECTIONS[hit].href);
      } else {
        pinned = hit; // −1, an empty spot, lets it relax into superposition
      }
    };

    const onPointerEnd = () => {
      press = null;
      mx = null;
      my = null;
    };

    const container = canvas.parentElement ?? canvas;
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerEnd);
    container.addEventListener("pointerleave", onPointerEnd);

    // Mouse: navigate to whatever section is measured, from anywhere on the
    // canvas; no need to move onto the word itself. Touch enters on release,
    // above, so the click that follows a tap is ignored.
    const onCanvasClick = () => {
      if (!touch && targetRef.current >= 0) {
        router.push(SECTIONS[targetRef.current].href);
      }
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
      // Keyboard focus measures the state exactly like cursor proximity does.
      const focusIdx = linkRefs.current.findIndex(
        (el) => el && el === document.activeElement,
      );

      // Target distribution for this frame.
      let want: number[];
      if (focusIdx >= 0) {
        want = oneHot(focusIdx);
      } else if (mx != null && my != null) {
        const cx = mx;
        const cy = my;
        const temp = TEMP * scale;
        const ex = anchors.map(([ax, ay]) =>
          Math.exp(-Math.hypot(cx - ax, cy - ay) / temp),
        );
        const sum = ex.reduce((a, b) => a + b, 0) || 1;
        want = ex.map((v) => v / sum);
      } else if (pinned >= 0) {
        want = oneHot(pinned);
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
          // On a phone the collapse is felt as well as seen, where supported.
          if (touch) navigator.vibrate?.(8);
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
        const spread = (1 - 0.62 * amp) * scale;
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
        // Touch enters through the tap handler, so the link itself stays
        // inert there and a tap can never navigate twice.
        el.style.pointerEvents =
          !touch && measured && i === lead ? "auto" : "none";
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

        if (mx == null && focusIdx < 0 && pinned < 0) {
          const verb = touch || coarse ? "tap" : "move";
          measRef.current.textContent = `${IDLE_MEASUREMENT} · ${verb} to measure`;
        } else if (frozen) {
          measRef.current.textContent = `⟨zeno⟩ = ${SECTIONS[lead].id}   ·   a watched state never evolves`;
        } else if (measured) {
          const next = touch && mx == null ? "  ·  tap again to enter" : "";
          measRef.current.textContent = `⟨measured⟩ = ${SECTIONS[lead].id}${next}`;
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
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerEnd);
      container.removeEventListener("pointerleave", onPointerEnd);
      canvas.removeEventListener("click", onCanvasClick);
    };
  }, [router]);

  return (
    <>
      {/* touch-none: a finger dragging here measures, so it must not also
          scroll or zoom the page underneath. */}
      <div className="relative mt-2 min-h-[280px] flex-1 touch-none sm:min-h-[480px]">
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
            className="absolute top-(--narrow-y) left-(--narrow-x) whitespace-nowrap text-center text-[#f3ead9] no-underline sm:top-(--wide-y) sm:left-(--wide-x)"
            style={
              {
                "--wide-x": `${s.wide[0] * 100}%`,
                "--wide-y": `${s.wide[1] * 100}%`,
                "--narrow-x": `${s.narrow[0] * 100}%`,
                "--narrow-y": `${s.narrow[1] * 100}%`,
                transform: "translate(-50%,-50%)",
                // Only clarity transitions; position is driven per frame.
                transition: "opacity .45s ease, filter .45s ease",
              } as React.CSSProperties
            }
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
        <div className="mx-auto grid max-w-[600px] font-serif text-[18px] italic leading-[1.5] text-balance text-[#e6d9c2] sm:text-[22px]">
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
        {/* Two lines are held on a phone, where some of these wrap and others
            do not, so the line beneath never jumps as the state changes. */}
        <div
          ref={measRef}
          className="mt-4 min-h-[2lh] font-mono text-[12px] tracking-[.05em] text-balance text-gold sm:min-h-0 sm:text-[13px]"
        >
          {IDLE_MEASUREMENT} · move to measure
        </div>
      </div>
    </>
  );
}
