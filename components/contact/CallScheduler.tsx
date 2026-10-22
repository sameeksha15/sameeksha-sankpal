"use client";

import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { site } from "@/lib/site";

const NAMESPACE = "portfolio";

/**
 * Live Cal.com booking embed. Times are shown in the visitor's own timezone
 * and the slot is confirmed on booking, with no mailto round trip.
 */
export default function CallScheduler() {
  const [failed, setFailed] = useState(false);

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
      {/* Cal reports its own height back to the embed script and the container
          follows it, so this floor only covers the moment before it loads;
          keep it under the shortest real height or it leaves dead space. */}
      <div className="min-h-[420px] overflow-hidden rounded-lg border border-gold/20 bg-gold/3">
        <Cal
          namespace={NAMESPACE}
          calLink={site.cal}
          style={{ width: "100%" }}
          config={{ layout: "month_view", theme: "dark" }}
        />
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
