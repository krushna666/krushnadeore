import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";

export const metadata = buildMetadata({
  title: "Marketing Glossary | OlyxMedia",
  description: "Plain-English definitions of common digital marketing terms.",
  path: "/glossary",
});

export default async function GlossaryPage() {
  const terms = await prisma.glossaryTerm.findMany({ where: { status: "PUBLISHED" }, orderBy: { term: "asc" } });

  return (
    <>
      <Breadcrumbs items={[{ name: "Glossary", path: "/glossary" }]} />
      <section className="container-page max-w-3xl pb-16">
        <h1 className="text-4xl font-bold tracking-tight">Marketing Glossary</h1>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {terms.map((t) => (
            <Link key={t.id} href={`/glossary/${t.slug}`} className="rounded-2xl border border-border p-4 hover:border-brand">
              <p className="font-semibold">{t.term}</p>
              <p className="mt-1 text-sm text-muted line-clamp-2">{t.definition}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
