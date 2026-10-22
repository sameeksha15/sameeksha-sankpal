import { getPosts } from "@/lib/blog";
import { absoluteUrl, site } from "@/lib/site";

// Emitted once at build time so the feed ships with the static export.
export const dynamic = "force-static";

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );

export function GET() {
  const posts = getPosts();
  const self = absoluteUrl("/feed.xml");

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}/`);
      const title = post.subtitle
        ? `${post.title}: ${post.subtitle}`
        : post.title;
      return `    <item>
      <title>${escape(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${post.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(post.excerpt)}</description>
${post.tags.map((tag) => `      <category>${escape(tag)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)} · Blog</title>
    <link>${absoluteUrl("/blog/")}</link>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
    <description>Notes and essays on quantum machine learning, noise, and what sits next to them.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
