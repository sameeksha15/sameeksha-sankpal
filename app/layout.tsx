import type { Metadata } from "next";
import { Source_Serif_4, JetBrains_Mono } from "next/font/google";
import NoCloning from "@/components/NoCloning";
import { absoluteUrl, site } from "@/lib/site";
import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif-face",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-face",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description:
    "Sameeksha Sankpal, a final-year Information Technology (Honours in Research) student at V.E.S. Institute of Technology, Mumbai, working on quantum computing and machine learning.",
  // Left without a title or url so each page's own title and address are
  // what a shared link shows, rather than every page posing as the homepage.
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
  twitter: { card: "summary" },
  verification: site.googleVerification
    ? { google: site.googleVerification }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body className="antialiased">
        <NoCloning />
        {children}
      </body>
    </html>
  );
}
