"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { site } from "@/lib/site";

const NAMESPACE = "portfolio";
const CONFIG = { layout: "month_view", theme: "dark" } as const;

// On a phone Cal stacks its details, calendar and every free slot of the day
// into one column close to 3,000px tall, so there the calendar opens in Cal's
// own full-screen sheet instead of sitting inline.
const WIDE = "(min-width: 640px)";

function useWide() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(WIDE);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}

/**
 * Live Cal.com booking. Times are shown in the visitor's own timezone and the
 * slot is confirmed on booking, with no mailto round trip.
 */
export default function CallScheduler() {
  const [failed, setFailed] = useState(false);
  const calRef = useRef<Awaited<ReturnType<typeof getCalApi>> | null>(null);
  const wide = useWide();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cal = await getCalApi({ namespace: NAMESPACE });
        if (cancelled) return;
        cal("ui", {
          theme: "dark",
          hideEventTypeDetails: false,
          layout: "month_view",
          cssVarsPerTheme: {
            light: { "cal-brand": "#d8a854" },
            dark: { "cal-brand": "#d8a854" },
          },
        });
        calRef.current = cal;
      } catch {
        // Blocked script, offline, or an ad blocker: fall back to a plain link
        // rather than leaving an empty box on the page.
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const bookingUrl = `https://cal.com/${site.cal}`;

  // Until Cal's script is ready, the button still works: it opens the page.
  const openSheet = () => {
    if (calRef.current) {
      calRef.current("modal", { calLink: site.cal, config: CONFIG });
    } else {
      window.open(bookingUrl, "_blank", "noreferrer");
    }
  };

  if (failed) {
    return (
      <div className="mt-9 rounded-lg border border-gold/20 bg-gold/3 px-6 py-8 text-center">
        <p className="font-serif text-[17px] leading-[1.7] text-khaki">
          The booking calendar did not load.
        </p>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block font-mono text-[13px] font-medium tracking-[.14em] text-gold no-underline transition-colors hover:text-gold-bright"
        >
          OPEN IT ON CAL.COM &#8599;
        </a>
      </div>
    );
  }

  return (
    <div className="mt-9">
      <button
        type="button"
        onClick={openSheet}
        className="flex w-full items-center justify-center rounded-lg border border-gold/30 bg-gold/5 py-5 font-mono text-[13px] font-medium tracking-[.14em] text-gold transition-colors active:bg-gold/12 sm:hidden"
      >
        CHOOSE A TIME &rarr;
      </button>

      {/* Cal reports its own height back to the embed script and the container
          follows it, so this floor only covers the moment before it loads;
          keep it under the shortest real height or it leaves dead space. The
          frame is always rendered so wide screens do not shift on load, but
          the calendar inside is only mounted where it is shown, so a phone
          never downloads it. */}
      <div className="hidden min-h-[420px] overflow-hidden rounded-lg border border-gold/20 bg-gold/3 sm:block">
        {wide && (
          <Cal
            namespace={NAMESPACE}
            calLink={site.cal}
            style={{ width: "100%" }}
            config={CONFIG}
          />
        )}
      </div>

      <p className="mt-4 font-mono text-[11.5px] tracking-[.04em] text-faint">
        slots appear in your timezone &middot; or{" "}
        <a
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
          className="text-stone no-underline transition-colors hover:text-gold"
        >
          open it on cal.com &#8599;
        </a>
      </p>
    </div>
  );
}
