import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkDetail from "@/components/WorkDetail";
import { research } from "@/lib/research";
import { findBySlug } from "@/lib/work";

export function generateStaticParams() {
  return research.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = findBySlug(research, slug);
  if (!item) return {};
  return { title: item.title, description: item.summary };
}

export default async function ResearchDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findBySlug(research, slug);
  if (!item) notFound();
  return <WorkDetail item={item} backHref="/research" backLabel="research" />;
}
