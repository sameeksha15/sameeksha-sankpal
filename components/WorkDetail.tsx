import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import { site } from "@/lib/site";
import type { WorkItem, WorkSection } from "@/lib/work";
import { SHELL } from "@/lib/layout";

/** Index of the `}` closing the `{` at `open`. */
function matchBrace(src: string, open: number): number {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0) return i;
  }
  return -1;
}

/**
 * Sets mathematics the usual way: `*x*` is an italic variable, `_{}` and `^{}`
 * are sub- and superscripts, and everything else (numerals, operators,
 * function names) stays upright.
 */
function math(src: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let buf = "";
  const flush = () => {
    if (buf) {
      out.push(buf);
      buf = "";
    }
  };
  for (let i = 0; i < src.length; ) {
    const c = src[i];
    if (c === "*" && src.indexOf("*", i + 1) !== -1) {
      const end = src.indexOf("*", i + 1);
      flush();
      out.push(
        <em key={out.length} className="italic">
          {src.slice(i + 1, end)}
        </em>,
      );
      i = end + 1;
    } else if ((c === "_" || c === "^") && src[i + 1] === "{") {
      const end = matchBrace(src, i + 1);
      if (end === -1) {
        buf += c;
        i++;
        continue;
      }
      flush();
      const inner = math(src.slice(i + 2, end));
      out.push(
        c === "_" ? (
          <sub key={out.length}>{inner}</sub>
        ) : (
          <sup key={out.length}>{inner}</sup>
        ),
      );
      i = end + 1;
    } else {
      buf += c;
      i++;
    }
  }
  flush();
  return out;
}

function Equation({ body, number }: NonNullable<WorkSection["equation"]>) {
  return (
    <div className="relative my-9">
      <div className="text-center font-serif text-[19px] leading-[1.6] text-cream">
        {math(body)}
      </div>
      {number && (
        <span className="absolute top-1/2 right-0 -translate-y-1/2 font-mono text-[11px] text-faint">
          ({number})
        </span>
      )}
    </div>
  );
}

/** Text in backticks is a real code identifier, so it is set in monospace. */
function prose(text: string): React.ReactNode[] {
  return text
    .split("`")
    .map((part, i) =>
      i % 2 ? (
        <code
          key={i}
          className="rounded bg-gold/8 px-[6px] py-[1px] font-mono text-[0.84em] text-[#e0c58e]"
        >
          {part}
        </code>
      ) : (
        part
      ),
    );
}

export default function WorkDetail({
  item,
  backHref,
  backLabel,
}: {
  item: WorkItem;
  backHref: string;
  backLabel: string;
}) {
  const meta = [item.venue, item.dates].filter(Boolean).join(" · ");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`${SHELL} flex-1 px-5 pt-[30px] pb-20 sm:px-11`}>
        <article className="mx-auto max-w-[720px]">
          <FadeUp as="span" className="inline-block">
            <Link
              href={backHref}
              className="font-mono text-xs font-medium tracking-[.1em] text-stone no-underline transition-colors hover:text-gold"
            >
              &larr; {backLabel}
            </Link>
          </FadeUp>

          <FadeUp delay={0.05}>
            <div className="mt-[34px] font-mono text-xs font-medium tracking-[.14em] text-gold">
              {item.kicker}
            </div>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="mt-[14px] font-serif text-[clamp(34px,5.5vw,48px)] leading-[1.12] tracking-[-.015em]">
              {item.title}
            </h1>
          </FadeUp>

          {(meta || item.tags.length > 0) && (
            <FadeUp delay={0.1}>
              {/* A title block closed by a rule, the way a paper's masthead is */}
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gold/12 pb-5 font-mono text-xs tracking-[.06em] text-faint">
                {meta && <span>{meta}</span>}
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-gold/20 px-2 py-[3px] text-parchment"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeUp>
          )}

          <FadeUp
            delay={0.14}
            className="mt-10 font-serif text-lg leading-[1.9] text-sand"
          >
            {(() => {
              let n = 0; // headed sections are numbered, the way a paper's are
              return item.sections.map((section, i) => {
                const num = section.heading ? String(++n).padStart(2, "0") : null;
                return (
                  <section key={i} className={i > 0 ? "mt-10" : ""}>
                    {section.heading && (
                      <h2 className="mb-4 flex items-baseline gap-3 font-serif text-[26px] leading-[1.3] text-bright">
                        <span className="font-mono text-[12px] tracking-[.12em] text-gold/70">
                          {num}
                        </span>
                        {section.heading}
                      </h2>
                    )}
                    {section.paragraphs?.map((p, j) => (
                      <p key={j} className={j > 0 ? "mt-4" : ""}>
                        {prose(p)}
                      </p>
                    ))}
                    {section.equation && <Equation {...section.equation} />}
                    {section.bullets && (
                      <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-gold">
                        {section.bullets.map((b, j) => (
                          <li key={j}>{prose(b)}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              });
            })()}
          </FadeUp>

          {item.images && item.images.length > 0 && (
            <FadeUp delay={0.16} className="mt-12 space-y-8">
              {item.images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  className="w-full rounded-lg border border-gold/14"
                />
              ))}
            </FadeUp>
          )}

          {item.links && item.links.length > 0 && (
            <FadeUp delay={0.18} className="mt-12 border-t border-gold/14 pt-6">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {item.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[13px] tracking-[.1em] text-gold no-underline transition-colors hover:text-gold-bright"
                  >
                    {link.label} &#8599;
                  </a>
                ))}
              </div>
            </FadeUp>
          )}

          <FadeUp
            delay={0.2}
            className="mt-14 flex justify-between border-t border-gold/14 pt-5 font-mono text-[13px] text-stone"
          >
            <Link
              href={backHref}
              className="text-linen no-underline transition-colors hover:text-gold"
            >
              &larr; {backLabel}
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="text-linen no-underline transition-colors hover:text-gold"
            >
              get in touch
            </a>
          </FadeUp>
        </article>
      </main>
      <Footer />
    </div>
  );
}
