import { prisma } from "@/lib/db";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";
import { JsonLd } from "@/components/marketing/json-ld";

export const metadata = buildMetadata({
  title: "Frequently Asked Questions | OlyxMedia",
  description: "Answers to common questions about working with OlyxMedia.",
  path: "/faq",
});

export default async function FaqPage() {
  const faqs = await prisma.fAQ.findMany({ where: { published: true }, orderBy: { order: "asc" } });

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))} />}
      <Breadcrumbs items={[{ name: "FAQ", path: "/faq" }]} />
      <section className="container-page max-w-3xl pb-16">
        <h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details key={f.id} className="rounded-2xl border border-border p-4">
              <summary className="cursor-pointer font-medium">{f.question}</summary>
              <p className="mt-2 text-sm text-muted">{f.answer}</p>
            </details>
          ))}
          {faqs.length === 0 && <p className="text-sm text-muted">FAQs coming soon.</p>}
        </div>
      </section>
      <CtaSection />
    </>
  );
}
