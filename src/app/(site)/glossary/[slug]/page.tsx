import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";

async function getTerm(slug: string) {
  return prisma.glossaryTerm.findFirst({ where: { slug, status: "PUBLISHED" } });
}

export async function generateMetadata({ params }: PageProps<"/glossary/[slug]">) {
  const { slug } = await params;
  const term = await getTerm(slug);
  if (!term) return {};
  return buildMetadata({
    title: `${term.term} — Marketing Glossary | OlyxMedia`,
    description: term.definition,
    path: `/glossary/${term.slug}`,
  });
}

export default async function GlossaryTermPage({ params }: PageProps<"/glossary/[slug]">) {
  const { slug } = await params;
  const term = await getTerm(slug);
  if (!term) notFound();

  const related = term.relatedTermSlugs.length
    ? await prisma.glossaryTerm.findMany({ where: { slug: { in: term.relatedTermSlugs }, status: "PUBLISHED" } })
    : [];

  return (
    <>
      <Breadcrumbs items={[{ name: "Glossary", path: "/glossary" }, { name: term.term, path: `/glossary/${term.slug}` }]} />
      <section className="container-page max-w-2xl pb-16">
        <h1 className="text-4xl font-bold tracking-tight">{term.term}</h1>
        <p className="mt-4 text-lg text-muted">{term.definition}</p>
        {term.example && (
          <div className="mt-6 rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold">Example</p>
            <p className="mt-1 text-sm text-muted">{term.example}</p>
          </div>
        )}
        {related.length > 0 && (
          <div className="mt-8">
            <p className="mb-2 text-sm font-semibold">Related terms</p>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link key={r.id} href={`/glossary/${r.slug}`} className="rounded-full border border-border px-3 py-1 text-sm hover:border-brand">
                  {r.term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
