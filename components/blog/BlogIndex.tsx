"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import FadeUp from "@/components/FadeUp";
import Pagination from "@/components/blog/Pagination";
import Subscribe from "@/components/blog/Subscribe";
import type { Post } from "@/lib/blog";

const ALL = "all";
const PER_PAGE = 6;
// Tags arrive most-used first, so the head of the list is the useful part.
// The rest stay one click away rather than growing the row without limit.
const TAG_LIMIT = 8;

type View = { query: string; tag: string; page: number };
const BLANK: View = { query: "", tag: ALL, page: 1 };

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Marks the searched-for text where it appears, so a hit is visible in place. */
function highlight(text: string, query: string) {
  const q = query.trim();
  if (q.length < 2) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark
        key={i}
        className="bg-transparent text-gold-bright underline decoration-gold/40 underline-offset-[3px]"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export default function BlogIndex({
  posts,
  tags,
  feedUrl,
  email,
  newsletter,
}: {
  posts: Post[];
  tags: string[];
  feedUrl: string;
  email: string;
  newsletter: string;
}) {
  // Held together rather than as three pieces of state, so restoring from the
  // URL is a single write and `null` cleanly means "not read yet".
  const [view, setView] = useState<View | null>(null);
  const { query, tag, page } = view ?? BLANK;
  const [allTags, setAllTags] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // The URL is only legible once mounted, and the first render has to match
  // the prerendered HTML, so this is the one deliberate render-then-correct.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView({
      query: params.get("q") ?? "",
      tag: params.get("tag") ?? ALL,
      page: Math.max(1, Number(params.get("page")) || 1),
    });
  }, []);

  // A searched or filtered page is worth linking to, so the state lives in the
  // URL as well. replaceState keeps the back button pointing at whatever came
  // before the blog rather than at every keystroke.
  useEffect(() => {
    if (!view) return;
    const params = new URLSearchParams();
    if (view.query.trim()) params.set("q", view.query.trim());
    if (view.tag !== ALL) params.set("tag", view.tag);
    if (view.page > 1) params.set("page", String(view.page));
    const search = params.toString();
    window.history.replaceState(
      null,
      "",
      search ? `?${search}` : window.location.pathname,
    );
  }, [view]);

  // "/" to search and Escape to clear, the shortcut most readers already have
  // in their fingers.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "Escape" && typing) {
        setView((prev) => ({ ...(prev ?? BLANK), query: "", page: 1 }));
        searchRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Numbered oldest-first, so a post keeps its number as the list grows and
  // neither filtering nor paging ever renumbers what is already published.
  const numbered = useMemo(
    () => posts.map((post, i) => ({ post, n: posts.length - i })),
    [posts],
  );

  // Searching and filtering run across every post, not just the page on
  // screen, so a match is never hidden behind pagination.
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return numbered.filter(({ post }) => {
      if (tag !== ALL && !post.tags.includes(tag)) return false;
      if (!q) return true;
      return [post.title, post.subtitle ?? "", post.excerpt, ...post.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [numbered, query, tag]);

  const pageCount = Math.max(1, Math.ceil(matches.length / PER_PAGE));
  // Clamped rather than stored, so a stale ?page= or a newly narrowed search
  // lands on a real page instead of an empty one.
  const current = Math.min(page, pageCount);
  const shown = matches.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const filtered = matches.length !== posts.length;

  const shownTags = useMemo(() => {
    if (allTags || tags.length <= TAG_LIMIT) return tags;
    const head = tags.slice(0, TAG_LIMIT);
    // A tag chosen from the expanded row stays visible after it collapses.
    return tag !== ALL && !head.includes(tag) ? [...head, tag] : head;
  }, [tags, tag, allTags]);

  /** Any change to what is being looked for starts again at page one. */
  function narrow(patch: Partial<Omit<View, "page">>) {
    setView((prev) => ({ ...(prev ?? BLANK), ...patch, page: 1 }));
  }

  function goToPage(next: number) {
    setView((prev) => ({ ...(prev ?? BLANK), page: next }));
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <FadeUp delay={0.12} className="mt-11">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-b border-gold/12 py-4">
          <div className="flex min-w-[200px] flex-1 items-center">
            <span
              aria-hidden
              className="mr-3 font-mono text-[13px] text-faint select-none"
            >
              &#8981;
            </span>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => narrow({ query: e.target.value })}
              placeholder="search posts"
              aria-label="Search posts"
              className="w-full bg-transparent font-mono text-[13px] text-cream placeholder:text-faint focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => narrow({ query: "" })}
                aria-label="Clear search"
                className="rounded border border-gold/20 px-[6px] py-[1px] font-mono text-[10px] text-taupe transition-colors hover:border-gold/40 hover:text-gold"
              >
                esc
              </button>
            ) : (
              <kbd className="pointer-events-none hidden rounded border border-gold/20 px-[6px] py-[1px] font-mono text-[10px] text-faint sm:block">
                /
              </kbd>
            )}
          </div>

          <span className="font-mono text-[11px] tracking-[.08em] whitespace-nowrap text-taupe">
            <em className="italic">N</em> ={" "}
            <span className="text-parchment">{matches.length}</span>
            {filtered && <span className="text-faint"> / {posts.length}</span>}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {[ALL, ...shownTags].map((t) => {
            const active = t === tag;
            return (
              <button
                key={t}
                type="button"
                onClick={() => narrow({ tag: t })}
                aria-pressed={active}
                className={`rounded-full border px-[11px] py-[3px] font-mono text-[11px] tracking-[.06em] transition-colors ${
 active
 ? "border-gold/45 bg-gold/10 text-gold"
 : "border-gold/14 text-taupe hover:border-gold/30 hover:text-parchment"
 }`}
              >
                {t}
              </button>
            );
          })}
          {tags.length > TAG_LIMIT && (
            <button
              type="button"
              onClick={() => setAllTags((v) => !v)}
              aria-expanded={allTags}
              className="px-[6px] py-[3px] font-mono text-[11px] tracking-[.06em] text-faint transition-colors hover:text-gold"
            >
              {allTags ? "fewer" : `+${tags.length - TAG_LIMIT} more`}
            </button>
          )}
        </div>
      </FadeUp>

      <FadeUp delay={0.16} className="mt-9">
        <div ref={listRef} className="scroll-mt-8">
          {shown.length === 0 ? (
            <p className="border-t border-gold/12 py-12 text-center font-mono text-[13px] text-taupe">
              Nothing here matches.{" "}
              <button
                type="button"
                onClick={() => narrow({ query: "", tag: ALL })}
                className="text-gold underline underline-offset-4 hover:text-gold-bright"
              >
                reset
              </button>
            </p>
          ) : (
            shown.map(({ post, n }, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group grid items-baseline gap-x-8 gap-y-3 border-t border-gold/12 py-[30px] text-inherit no-underline md:grid-cols-[110px_1fr_auto] ${
 i === shown.length - 1 ? "border-b" : ""
 }`}
              >
                <span className="flex items-baseline gap-2 md:flex-col md:gap-[6px]">
                  <span className="font-mono text-[11px] text-gold/55 tabular-nums">
                    [{n}]
                  </span>
                  <span className="font-mono text-xs tracking-[.08em] text-faint">
                    {post.dateLabel}
                  </span>
                </span>
                <span>
                  <span className="block font-serif text-[24px] text-bright transition-colors duration-300 group-hover:text-gold sm:text-[27px]">
                    {highlight(post.title, query)}
                  </span>
                  <span className="mt-[10px] block font-serif text-base leading-[1.7] text-khaki">
                    {highlight(post.excerpt, query)}
                  </span>
                  <span className="mt-3 flex flex-wrap gap-x-3 font-mono text-[10.5px] tracking-[.08em] text-faint">
                    {post.tags.map((t) => (
                      <span key={t} className={t === tag ? "text-gold/70" : ""}>
                        {t}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="font-mono text-xs tracking-[.1em] whitespace-nowrap text-taupe">
                  {post.readingTime}{" "}
                  <span className="inline-block -translate-x-1 opacity-40 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    &rarr;
                  </span>
                </span>
              </Link>
            ))
          )}
        </div>

        <Pagination current={current} total={pageCount} onChange={goToPage} />
      </FadeUp>

      {/* Quiet here on purpose: the real invitation sits at the end of each
          post, where someone has actually read something first. */}
      <Subscribe
        variant="inline"
        username={newsletter}
        feedUrl={feedUrl}
        email={email}
      />
    </>
  );
}
