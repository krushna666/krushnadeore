import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata = buildMetadata({
  title: "Client Testimonials | OlyxMedia",
  description: "What OlyxMedia clients say about working with us.",
  path: "/testimonials",
});

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });

  return (
    <>
      <Breadcrumbs items={[{ name: "Testimonials", path: "/testimonials" }]} />
      <section className="container-page pb-16">
        <h1 className="text-4xl font-bold tracking-tight">Client Testimonials</h1>
        {testimonials.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-2xl border border-border p-5">
                <p className="text-sm">&ldquo;{t.review}&rdquo;</p>
                <p className="mt-3 text-sm font-semibold">{t.clientName}</p>
                <p className="text-xs text-muted">
                  {t.designation}
                  {t.company ? `, ${t.company}` : ""}
                </p>
                {t.googleReviewUrl && (
                  <a href={t.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-brand hover:underline">
                    View on Google →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">Client testimonials coming soon.</p>
        )}
      </section>
      <CtaSection />
    </>
  );
}
