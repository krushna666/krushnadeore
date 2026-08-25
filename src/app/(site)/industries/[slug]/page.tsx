import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";
import { JsonLd } from "@/components/marketing/json-ld";

async function getIndustry(slug: string) {
  return prisma.industry.findFirst({ where: { slug, status: "PUBLISHED" }, include: { faqs: { where: { published: true } } } });
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const industry = await getIndustry(slug);
  if (!industry) return {};
  return buildMetadata({
    title: industry.seoTitle || `Digital Marketing for ${industry.name} Businesses | OlyxMedia`,
    description: industry.metaDescription || industry.challenges || "",
    path: `/industries/${industry.slug}`,
    noindex: industry.robotsNoindex,
  });
}

export default async function IndustryDetailPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const industry = await getIndustry(slug);
  if (!industry) notFound();

  return (
    <>
      {industry.faqs.length > 0 && (
        <JsonLd data={faqJsonLd(industry.faqs.map((f) => ({ question: f.question, answer: f.answer })))} />
      )}
      <Breadcrumbs items={[{ name: "Industries", path: "/industries" }, { name: industry.name, path: `/industries/${industry.slug}` }]} />
      <section className="container-page max-w-3xl pb-16">
        <h1 className="text-4xl font-bold tracking-tight">Digital Marketing for {industry.name} Businesses</h1>
        {industry.challenges && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Industry challenges</h2>
            <p className="mt-2 text-muted">{industry.challenges}</p>
          </div>
        )}
        {industry.solution && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">OlyxMedia&apos;s approach</h2>
            <p className="mt-2 text-muted">{industry.solution}</p>
          </div>
        )}
        {industry.recommendedServices.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Recommended services</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
              {industry.recommendedServices.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {industry.contentStrategy && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Content strategy</h2>
            <p className="mt-2 text-muted">{industry.contentStrategy}</p>
          </div>
        )}
        {industry.leadGenStrategy && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Lead generation strategy</h2>
            <p className="mt-2 text-muted">{industry.leadGenStrategy}</p>
          </div>
        )}
        {industry.seoStrategy && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">SEO strategy</h2>
            <p className="mt-2 text-muted">{industry.seoStrategy}</p>
          </div>
        )}
        {industry.faqs.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold">FAQs</h2>
            <div className="mt-3 space-y-3">
              {industry.faqs.map((f) => (
                <details key={f.id} className="rounded-xl border border-border p-4">
                  <summary className="cursor-pointer font-medium">{f.question}</summary>
                  <p className="mt-2 text-sm text-muted">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}
      </section>
      <CtaSection />
    </>
  );
}
