// Shared shape for research items and projects. Detail pages and index rows
// are both driven from these records.

export type WorkSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  /**
   * A displayed equation, set after this section's paragraphs. Text between
   * asterisks is italicised: variables are set in italic while numbers,
   * operators and function names stay upright, as mathematics is normally set.
   */
  equation?: { body: string; number?: string };
};

export type WorkLink = {
  label: string;
  href: string;
};

export type WorkImage = {
  src: string;
  alt: string;
};

export type WorkItem = {
  slug: string;
  kicker: string; // e.g. "HONOURS THESIS · ONGOING"
  title: string;
  venue?: string;
  dates?: string; // shown to the reader
  /** Sort key only, newest first. Most recent activity, as YYYY-MM. */
  sortDate: string;
  tags: string[];
  summary: string; // one line for the index
  sections: WorkSection[];
  links?: WorkLink[]; // GitHub etc.; omitted rows render nothing
  images?: WorkImage[]; // screenshots, dropped into public/ when available
};

export function findBySlug(items: WorkItem[], slug: string): WorkItem | undefined {
  return items.find((item) => item.slug === slug);
}

/** Most recent first. */
export function byNewest<T extends { sortDate: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1));
}
