import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata = buildMetadata({
  title: "Case Studies | OlyxMedia",
  description: "Real client case studies from OlyxMedia — verified results only.",
  path: "/case-studies",
});

export default async function CaseStudiesPage() {
  const caseStudies = await prisma.caseStudy.findMany({ where: { status: "PUBLISHED" }, orderBy: { updatedAt: "desc" } });

  return (
    <>
      <Breadcrumbs items={[{ name: "Case Studies", path: "/case-studies" }]} />
      <section className="container-page pb-16">
        <h1 className="text-4xl font-bold tracking-tight">Case Studies</h1>
        <p className="mt-3 max-w-2xl text-muted">Real client work. We only publish verified results.</p>
        {caseStudies.length > 0 ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {caseStudies.map((cs) => (
              <Link key={cs.id} href={`/case-studies/${cs.slug}`} className="rounded-2xl border border-border p-5 hover:border-brand">
                <p className="font-semibold">{cs.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {cs.clientName} {cs.industry && `· ${cs.industry}`}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">Case study coming soon — real client results, verified before publishing.</p>
        )}
      </section>
      <CtaSection />
    </>
  );
}
