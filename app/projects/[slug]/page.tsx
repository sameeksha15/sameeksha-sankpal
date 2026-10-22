import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkDetail from "@/components/WorkDetail";
import { projects } from "@/lib/projects";
import { findBySlug } from "@/lib/work";

export function generateStaticParams() {
  return projects.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = findBySlug(projects, slug);
  if (!item) return {};
  return { title: item.title, description: item.summary };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findBySlug(projects, slug);
  if (!item) notFound();
  return <WorkDetail item={item} backHref="/projects" backLabel="projects" />;
}
