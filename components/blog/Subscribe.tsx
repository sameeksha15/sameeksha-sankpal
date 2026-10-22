"use client";

import { useId, useRef, useState } from "react";
import FadeUp from "@/components/FadeUp";

type State = "idle" | "sending" | "done" | "invalid";

// Buttondown's documented embed endpoint. It takes a plain cross-origin form
// POST, which is what lets a static site subscribe anyone at all.
const endpoint = (username: string) =>
  `https://buttondown.com/api/emails/embed-subscribe/${username}`;

/**
 * `panel` is the full pitch, for the foot of a post, where someone has just
 * finished reading and has a reason to say yes. `inline` is a single quiet row
 * for the index, where nobody has read anything yet.
 */
export default function Subscribe({
  username,
  feedUrl,
  email,
  variant = "panel",
}: {
  username: string;
  feedUrl: string;
  email: string;
  variant?: "panel" | "inline";
}) {
  const [state, setState] = useState<State>("idle");
  const [copied, setCopied] = useState(false);
  const pending = useRef(false);
  // Two of these can share a page, so the form and the frame it posts into
  // need ids that do not collide. Stripped to word characters because the
  // value also names a browsing context.
  const uid = `bd${useId().replace(/\W/g, "")}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked; the visible link is still there to copy by hand.
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const field = e.currentTarget.elements.namedItem("email");
    const value = field instanceof HTMLInputElement ? field.value.trim() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      e.preventDefault();
      setState("invalid");
      return;
    }
    // The POST is left to the browser and lands in the hidden frame below, so
    // the page never navigates away.
    pending.current = true;
    setState("sending");
  }

  const form = username && (
    <>
      <form
        action={endpoint(username)}
        method="post"
        target={uid}
        onSubmit={onSubmit}
        // The browser's own warning is a white system bubble, so the check in
        // onSubmit reports in the page's own type instead.
        noValidate
        className={
          variant === "panel"
            ? "mt-5 flex max-w-[460px] flex-wrap items-center gap-x-4 gap-y-3"
            : "flex min-w-[260px] flex-1 flex-wrap items-center gap-x-3 gap-y-3"
        }
      >
        <label htmlFor={`${uid}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${uid}-email`}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          onChange={() => state === "invalid" && setState("idle")}
          aria-invalid={state === "invalid"}
          className={`min-w-[180px] flex-1 border-b bg-transparent pb-[6px] font-mono text-[13px] text-cream transition-colors placeholder:text-faint focus:border-gold/60 focus:outline-none ${
            state === "invalid" ? "border-[#c2704f]" : "border-gold/25"
          }`}
        />
        <input type="hidden" name="embed" value="1" />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full border border-gold/45 bg-gold/10 px-[15px] py-[5px] font-mono text-[12px] tracking-[.06em] text-gold transition-colors hover:border-gold/70 hover:text-gold-bright disabled:opacity-50"
        >
          {state === "sending" ? "sending" : "subscribe"}
        </button>
      </form>

      {/* Buttondown's reply lands here rather than replacing the page. It is
          cross-origin, so its load event is the only signal available. */}
      <iframe
        name={uid}
        title="Subscription result"
        aria-hidden
        tabIndex={-1}
        className="hidden"
        onLoad={() => {
          if (!pending.current) return;
          pending.current = false;
          setState("done");
        }}
      />
    </>
  );

  const invalidNote = state === "invalid" && (
    <p aria-live="polite" className="mt-3 font-mono text-[12px] text-[#c2704f]">
      That does not look like an email address.
    </p>
  );

  if (variant === "inline") {
    return (
      <div className="mt-12 max-w-[860px] border-t border-gold/12 pt-6">
        {state === "done" ? (
          <p
            aria-live="polite"
            className="font-serif text-[16px] leading-[1.7] text-sand"
          >
            Thanks. Check your inbox and click the confirmation link.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <span className="font-serif text-[16px] leading-[1.7] text-khaki">
                {username ? "New posts by email." : "New posts, by feed."}
              </span>
              {form}
              <a
                href={feedUrl}
                className="font-mono text-[12px] whitespace-nowrap text-taupe no-underline transition-colors hover:text-gold"
              >
                RSS &#8599;
              </a>
            </div>
            {invalidNote}
          </>
        )}
      </div>
    );
  }

  return (
    <FadeUp
      delay={0.18}
      className="mt-14 rounded-lg border border-gold/14 bg-ink-raised px-6 py-7 sm:px-8"
    >
      <div className="font-mono text-[11px] font-medium tracking-[.2em] text-gold">
        &#10216; SUBSCRIBE &#10217;
      </div>

      {state === "done" ? (
        <p
          aria-live="polite"
          className="mt-3 max-w-[460px] font-serif text-[16px] leading-[1.7] text-sand"
        >
          Thanks. Check your inbox and click the confirmation link.
        </p>
      ) : (
        <>
          <p className="mt-3 max-w-[460px] font-serif text-[16px] leading-[1.7] text-khaki">
            {username
              ? "If this was worth your time, new posts can come to you."
              : "The feed below updates whenever a post goes up."}
          </p>
          {form}
          {invalidNote}
        </>
      )}

      <div
        className={`flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[13px] ${
          username ? "mt-6 border-t border-gold/10 pt-5" : "mt-5"
        }`}
      >
        <a
          href={feedUrl}
          className="text-gold no-underline transition-colors hover:text-gold-bright"
        >
          RSS feed &#8599;
        </a>
        <button
          type="button"
          onClick={copy}
          className="text-linen transition-colors hover:text-gold"
        >
          {copied ? "copied" : "copy feed URL"}
        </button>
        {!username && (
          <a
            href={`mailto:${email}?subject=${encodeURIComponent("New posts")}`}
            className="text-linen no-underline transition-colors hover:text-gold"
          >
            or ask to be told directly
          </a>
        )}
      </div>
    </FadeUp>
  );
}
