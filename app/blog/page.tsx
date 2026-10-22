import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import BlogIndex from "@/components/blog/BlogIndex";
import { getPosts, getTags } from "@/lib/blog";
import { absoluteUrl, site } from "@/lib/site";
import { SHELL } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes and essays on what I’m working on or learning about, written so you can follow along without a background in the field.",
  alternates: {
    types: { "application/rss+xml": absoluteUrl("/feed.xml") },
  },
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`${SHELL} flex-1 px-5 pt-[30px] pb-[70px] sm:px-11`}>
        <FadeUp>
          <div className="font-mono text-xs font-medium tracking-[.22em] text-gold">
            &#10216; 04 &middot; THINKING OUT LOUD &#10217;
          </div>
        </FadeUp>
        <FadeUp delay={0.05}>
          <h1 className="mt-[14px] font-serif text-[clamp(44px,7vw,64px)] leading-[1.05] tracking-[-.015em]">
            Blog
          </h1>
        </FadeUp>
        <FadeUp delay={0.08}>
          <p className="mt-5 font-serif text-[17px] leading-[1.7] text-khaki">
            Notes and essays on what I’m working on or learning about. I try
            to write them so you can follow along without a background in the
            field.
          </p>
        </FadeUp>

        <BlogIndex
          posts={posts}
          tags={getTags()}
          feedUrl={absoluteUrl("/feed.xml")}
          email={site.email}
          newsletter={site.newsletter}
        />
      </main>
      <Footer />
    </div>
  );
}
