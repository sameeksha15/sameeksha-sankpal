"use client";

const GAP = "gap" as const;

/**
 * First page, last page, and a window around the current one, with gaps where
 * numbers were dropped. Up to seven pages are listed in full, since that fits
 * on a phone without wrapping.
 */
function pageList(current: number, total: number): (number | typeof GAP)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const keep = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((n) => keep.add(n));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => keep.add(n));

  const out: (number | typeof GAP)[] = [];
  let previous = 0;
  for (const n of [...keep].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)) {
    if (previous && n - previous > 1) out.push(GAP);
    out.push(n);
    previous = n;
  }
  return out;
}

export default function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  if (total <= 1) return null;

  const step = (delta: number) => onChange(current + delta);
  const edge =
    "font-mono text-[12px] tracking-[.08em] transition-colors disabled:cursor-default disabled:text-dust";

  return (
    <nav
      aria-label="Blog pages"
      className="mt-10 flex items-center justify-between gap-4 border-t border-gold/12 pt-6"
    >
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={current === 1}
        className={`${edge} text-taupe hover:text-gold`}
      >
        &larr; newer
      </button>

      <div className="flex items-center gap-1">
        {pageList(current, total).map((item, i) =>
          item === GAP ? (
            <span
              key={`gap-${i}`}
              aria-hidden
              className="px-1 font-mono text-[12px] text-dust"
            >
              &middot;&middot;&middot;
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === current ? "page" : undefined}
              className={`min-w-[26px] rounded border px-[6px] py-[2px] font-mono text-[12px] tabular-nums transition-colors ${
                item === current
                  ? "border-gold/45 bg-gold/10 text-gold"
                  : "border-transparent text-taupe hover:border-gold/25 hover:text-parchment"
              }`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => step(1)}
        disabled={current === total}
        className={`${edge} text-taupe hover:text-gold`}
      >
        older &rarr;
      </button>
    </nav>
  );
}
