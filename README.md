# Sameeksha Sankpal — Portfolio

Personal site covering research, projects and writing in quantum machine learning and differential privacy.

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Writes a static export to `out/`, which can be served by any static host.

## Structure

```
app/                routes, one folder per page, plus global styles
components/         shared chrome and per-page interactive pieces
content/blog/       blog posts as markdown with front matter
lib/                site config, content sources and shared types
public/             static assets
scripts/            post-build steps for the static export
.github/workflows/  build and deploy to GitHub Pages
```
