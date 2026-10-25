import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { projects } from "@/lib/projects";
import { research } from "@/lib/research";
import { absoluteUrl } from "@/lib/site";

// Emitted once at build time so the sitemap ships with the static export.
export const dynamic = "force-static";

const pages = ["/", "/about/", "/research/", "/projects/", "/blog/", "/contact/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((path) => ({ url: absoluteUrl(path) })),
    ...research.map((item) => ({ url: absoluteUrl(`/research/${item.slug}/`) })),
    ...projects.map((item) => ({ url: absoluteUrl(`/projects/${item.slug}/`) })),
    ...getPosts().map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}/`),
      lastModified: post.date,
    })),
  ];
}
