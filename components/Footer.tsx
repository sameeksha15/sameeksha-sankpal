import { site, withBasePath } from "@/lib/site";
import { FRAME } from "@/lib/layout";

export default function Footer({
  variant = "default",
  className = "",
}: {
  /** The contact page swaps the link list for a timezone note. */
  variant?: "default" | "timezone";
  className?: string;
}) {
  return (
    <footer
      className={`${FRAME} flex flex-wrap items-center justify-between gap-[14px] border-t border-gold/14 px-5 pt-[26px] pb-[34px] font-mono text-[13px] tracking-[.03em] text-stone sm:px-11 ${className}`}
    >
      <span>{site.location}</span>
      {variant === "timezone" ? (
        <span>IST &middot; UTC+5:30</span>
      ) : (
        <span className="flex flex-wrap gap-5">
          <a
            href={`mailto:${site.email}`}
            className="text-linen no-underline transition-colors hover:text-gold"
          >
            email
          </a>
          <a
            href={site.linkedin.url}
            target="_blank"
            rel="noreferrer"
            className="text-linen no-underline transition-colors hover:text-gold"
          >
            linkedin
          </a>
          <a
            href={site.github.url}
            target="_blank"
            rel="noreferrer"
            className="text-linen no-underline transition-colors hover:text-gold"
          >
            github
          </a>
          <a
            href={withBasePath(site.resume)}
            target="_blank"
            rel="noreferrer"
            className="text-gold no-underline"
          >
            resume &darr;
          </a>
        </span>
      )}
    </footer>
  );
}
