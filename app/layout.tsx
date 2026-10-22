import type { Metadata } from "next";
import { Source_Serif_4, JetBrains_Mono } from "next/font/google";
import NoCloning from "@/components/NoCloning";
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
  title: {
    default: "Sameeksha Sankpal",
    template: "%s · Sameeksha Sankpal",
  },
  description:
    "Portfolio of Sameeksha Sankpal: quantum machine learning, differential privacy, and the uses of noise.",
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
