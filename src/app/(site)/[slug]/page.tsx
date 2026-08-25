import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { buildMetadata, faqJsonLd, localBusinessJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";
import { JsonLd } from "@/components/marketing/json-ld";
import { LeadForm } from "@/components/marketing/lead-form";

async function getLocation(slug: string) {
  return prisma.location.findFirst({ where: { slug, status: "PUBLISHED" }, include: { faqs: { where: { published: true } } } });
}

export async function generateMetadata({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const location = await getLocation(slug);
  if (!location) return {};
  return buildMetadata({
    title: location.seoTitle || location.name,
    description: location.metaDescription || location.intro || "",
    path: `/${location.slug}`,
    noindex: location.robotsNoindex,
  });
}

export default async function LocationPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const location = await getLocation(slug);
  if (!location) notFound();

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      {location.faqs.length > 0 && (
        <JsonLd data={faqJsonLd(location.faqs.map((f) => ({ question: f.question, answer: f.answer })))} />
      )}
      <Breadcrumbs items={[{ name: location.name, path: `/${location.slug}` }]} />

      <section className="container-page grid gap-10 pb-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold tracking-tight">{location.name}</h1>
          {location.intro && <p className="mt-4 text-lg text-muted">{location.intro}</p>}

          {location.localProblems && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Local challenges we solve</h2>
              <p className="mt-2 text-muted">{location.localProblems}</p>
            </div>
          )}
          {location.servicesOffered.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Services in {location.city}</h2>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {location.servicesOffered.map((s) => (
                  <li key={s} className="rounded-lg border border-border p-3 text-sm">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {location.industriesServed.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Industries we work with here</h2>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
                {location.industriesServed.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {location.processContent && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">How we work</h2>
              <p className="mt-2 text-muted">{location.processContent}</p>
            </div>
          )}
          {location.faqs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold">FAQs</h2>
              <div className="mt-3 space-y-3">
                {location.faqs.map((f) => (
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
          <LeadForm compact />
        </aside>
      </section>
      <CtaSection />
    </>
  );
}
