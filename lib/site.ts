export const site = {
  name: "Sameeksha Sankpal",
  email: "sameekshasankpal@gmail.com",
  location: "Mumbai, India",
  linkedin: {
    url: "https://www.linkedin.com/in/sameeksha-sankpal-12aa72251",
    handle: "/sameeksha-sankpal",
  },
  github: {
    url: "https://github.com/sameeksha15",
    handle: "/sameeksha15",
  },
  resume: "/assets/Sameeksha-Sankpal-Resume.pdf",
  // Absolute origin, needed by the RSS feed because feed readers fetch the
  // file out of context and cannot resolve relative links. The deploy workflow
  // reads the real value from GitHub Pages, custom domain included, so this
  // fallback only ever applies to a local build, where a visibly local URL is
  // safer than a plausible wrong one.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Cal.com booking link, as "<username>/<event-slug>", the part of the URL
  // after cal.com/. Change it here and both the embed and the fallback
  // link follow.
  cal: "sameeksha-sankpal-b5iwgv/15min",
  // Buttondown username, the part of the URL after buttondown.com/. The blog's
  // subscribe form posts to it. While it is empty the form is hidden and the
  // panel offers the RSS feed on its own, so the page is never left with a
  // box that goes nowhere.
  newsletter: "sameeksha",
};

export const navItems = [
  { label: "about", href: "/about" },
  { label: "research", href: "/research" },
  { label: "projects", href: "/projects" },
  { label: "blog", href: "/blog" },
  { label: "contact", href: "/contact" },
];

// next/link prefixes basePath automatically, but plain <a> hrefs to files in
// public/ (like the resume) need it added by hand.
export function withBasePath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}

/** Fully qualified URL, for feeds and anything else read off-site. */
export function absoluteUrl(path: string): string {
  return `${site.url}${withBasePath(path)}`;
}
