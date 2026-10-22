import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import Subscribe from "@/components/blog/Subscribe";
import { getPost, getSlugs } from "@/lib/blog";
import { absoluteUrl, site } from "@/lib/site";
import { SHELL } from "@/lib/layout";

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = getPost(slug);
  if (!found) return {};
  return { title: found.post.title, description: found.post.excerpt };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = getPost(slug);
  if (!found) notFound();
  const { post, html } = found;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`${SHELL} flex-1 px-5 pt-[30px] pb-20 sm:px-11`}>
        <article className="mx-auto max-w-[720px]">
          <FadeUp as="span" className="inline-block">
            <Link
              href="/blog"
              className="font-mono text-xs font-medium tracking-[.1em] text-stone no-underline transition-colors hover:text-gold"
            >
              &larr; blog
            </Link>
          </FadeUp>

          <FadeUp delay={0.05}>
            <div className="mt-[34px] font-mono text-xs font-medium tracking-[.14em] text-gold">
              {post.dateLabel} &middot; {post.readingTime} READ
            </div>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="mt-[14px] font-serif text-[clamp(34px,5.5vw,52px)] leading-[1.12] tracking-[-.015em]">
              {post.title}
            </h1>
          </FadeUp>

          {post.subtitle && (
            <FadeUp delay={0.1}>
              <p className="mt-5 font-serif text-[19px] italic leading-[1.7] text-stone">
                {post.subtitle}
              </p>
            </FadeUp>
          )}

          <FadeUp delay={0.14}>
            <div
              className="prose-quantum mt-11"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </FadeUp>

          <Subscribe
            username={site.newsletter}
            feedUrl={absoluteUrl("/feed.xml")}
            email={site.email}
          />

          <FadeUp
            delay={0.22}
            className="mt-14 flex justify-between border-t border-gold/14 pt-5 font-mono text-[13px] text-stone"
          >
            <Link
              href="/blog"
              className="text-linen no-underline transition-colors hover:text-gold"
            >
              &larr; all posts
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="text-linen no-underline transition-colors hover:text-gold"
            >
              reply by email
            </a>
          </FadeUp>
        </article>
      </main>
      <Footer />
    </div>
  );
}
