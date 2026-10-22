# Sameeksha Sankpal — Portfolio

Personal portfolio website: quantum machine learning, differential privacy, and the uses of noise.

Built with [Next.js](https://nextjs.org) (App Router, static export), [Tailwind CSS](https://tailwindcss.com), and [GSAP](https://gsap.com). Deployed to GitHub Pages.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
```

## Production build

```bash
npm run build    # static export into out/
npx serve out    # preview the exported site locally
```

## Deploying to GitHub Pages

1. Push the repository to GitHub (branch `main`).
2. In the repo settings, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which builds the static export and publishes it.

The workflow sets the base path automatically, so the site works both as a user site (`username.github.io`) and as a project site (`username.github.io/repo-name`).

## Project layout

```
app/          routes (one folder per page) + global styles
components/   shared chrome and per-page interactive pieces (canvas scenes, scheduler)
lib/          site-wide constants (nav, contact links)
public/       static assets (CV)
design/       original Claude Design export — reference only, not deployed (gitignored)
```

## Content

Some entries (projects, capstone, publications, blog posts) are intentionally placeholder copy from the design phase; real content will replace them.
