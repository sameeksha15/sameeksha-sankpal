import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";

const BLOG_DIR = join(process.cwd(), "content", "blog");

export type Post = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  /**
   * Optional ordering override. The list is otherwise ordered by `date`, which
   * stays the true date of writing; this only moves a post within the list.
   */
  sortKey?: string;
  dateLabel: string;
  readingTime: string;
  excerpt: string;
  tags: string[];
};

// Own instance so options stay scoped to this renderer.
const marked = new Marked({ gfm: true, breaks: false });

function parse(slug: string) {
  const raw = readFileSync(join(BLOG_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  return { data: data as Omit<Post, "slug">, content };
}

export function getSlugs(): string[] {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** All posts, newest first. */
export function getPosts(): Post[] {
  return getSlugs()
    .map((slug) => ({ slug, ...parse(slug).data }))
    .sort((a, b) => {
      const ka = a.sortKey ?? a.date;
      const kb = b.sortKey ?? b.date;
      return ka < kb ? 1 : -1;
    });
}

/** Every tag in use, most frequent first, ties broken alphabetically. */
export function getTags(): string[] {
  const counts = new Map<string, number>();
  for (const post of getPosts()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

export function getPost(slug: string): { post: Post; html: string } | null {
  if (!getSlugs().includes(slug)) return null;
  const { data, content } = parse(slug);
  return { post: { slug, ...data }, html: marked.parse(content) as string };
}
