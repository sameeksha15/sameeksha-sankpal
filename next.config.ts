import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages: trailing slashes make every route its own
  // route/index.html so direct links resolve without a server.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Set by the deploy workflow when the site is served from a sub-path
  // (github.io/<repo>). Empty for user/organization root sites.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
};

export default nextConfig;
