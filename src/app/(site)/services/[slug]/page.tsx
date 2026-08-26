import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { buildMetadata, serviceJsonLd, faqJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";
import { JsonLd } from "@/components/marketing/json-ld";
import { LeadForm } from "@/components/marketing/lead-form";
import { Badge } from "@/components/ui/badge";

async function getService(slug: string) {
  return prisma.service.findFirst({ where: { slug, status: "PUBLISHED" }, include: { faqs: { where: { published: true } } } });
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.seoTitle || `${service.name} Agency in Pune | OlyxMedia`,
    description: service.metaDescription || service.shortDescription || "",
    path: `/services/${service.slug}`,
    ogImage: service.ogImageUrl,
    noindex: service.robotsNoindex,
  });
}

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      {service.faqs.length > 0 && (
        <JsonLd data={faqJsonLd(service.faqs.map((f) => ({ question: f.question, answer: f.answer })))} />
      )}
      <Breadcrumbs items={[{ name: "Services", path: "/services" }, { name: service.name, path: `/services/${service.slug}` }]} />

      <section className="container-page grid gap-10 pb-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold tracking-tight">{service.headline || service.name}</h1>
          {service.shortDescription && <p className="mt-4 text-lg text-muted">{service.shortDescription}</p>}

          {service.problem && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold">The problem</h2>
              <p className="mt-2 text-muted">{service.problem}</p>
            </div>
          )}
          {service.solution && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Our solution</h2>
              <p className="mt-2 text-muted">{service.solution}</p>
            </div>
          )}
          {service.deliverables.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Deliverables</h2>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {service.deliverables.map((d) => (
                  <li key={d} className="rounded-lg border border-border p-3 text-sm">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {service.process.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Our process</h2>
              <ol className="mt-2 space-y-2">
                {service.process.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm">
                    <span className="font-semibold text-brand">{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {service.benefits.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Benefits</h2>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
                {service.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}
          {service.idealClient && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Ideal client</h2>
              <p className="mt-2 text-muted">{service.idealClient}</p>
            </div>
          )}

          {service.faqs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold">FAQs</h2>
              <div className="mt-3 space-y-3">
                {service.faqs.map((f) => (
                  <details key={f.id} className="rounded-xl border border-border p-4">
                    <summary className="cursor-pointer font-medium">{f.question}</summary>
                    <p className="mt-2 text-sm text-muted">{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-border p-5 lg:sticky lg:top-24">
          <Badge className="mb-3">Free strategy call</Badge>
          <LeadForm compact defaultService={service.name} />
        </aside>
      </section>

      <CtaSection />
    </>
  );
}
