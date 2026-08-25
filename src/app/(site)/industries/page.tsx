import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata = buildMetadata({
  title: "Industries We Serve | OlyxMedia",
  description: "Digital marketing strategies tailored to healthcare, real estate, restaurants, education, e-commerce, startups and B2B businesses.",
  path: "/industries",
});

export default async function IndustriesPage() {
  const industries = await prisma.industry.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" } });

  return (
    <>
      <Breadcrumbs items={[{ name: "Industries", path: "/industries" }]} />
      <section className="container-page pb-16">
        <h1 className="text-4xl font-bold tracking-tight">Industries We Serve</h1>
        <p className="mt-3 max-w-2xl text-muted">Marketing strategies shaped around what actually works in your industry.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind) => (
            <Link key={ind.id} href={`/industries/${ind.slug}`} className="rounded-2xl border border-border p-5 transition hover:border-brand">
              <p className="font-semibold">{ind.name}</p>
              <p className="mt-1 text-sm text-muted line-clamp-2">{ind.challenges}</p>
            </Link>
          ))}
        </div>
      </section>
      <CtaSection />
    </>
  );
}
