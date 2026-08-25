import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";
import { Badge } from "@/components/ui/badge";

async function getCaseStudy(slug: string) {
  return prisma.caseStudy.findFirst({ where: { slug, status: "PUBLISHED" }, include: { testimonial: true } });
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) return {};
  return buildMetadata({
    title: cs.seoTitle || `${cs.title} | OlyxMedia Case Study`,
    description: cs.metaDescription || cs.challenge || "",
    path: `/case-studies/${cs.slug}`,
  });
}

const METRICS: { key: keyof NonNullable<Awaited<ReturnType<typeof getCaseStudy>>>; label: string; suffix?: string }[] = [
  { key: "reach", label: "Reach" },
  { key: "engagement", label: "Engagement" },
  { key: "leadsGenerated", label: "Leads Generated" },
  { key: "conversions", label: "Conversions" },
  { key: "roas", label: "ROAS", suffix: "x" },
  { key: "cpl", label: "CPL", suffix: "₹" },
  { key: "organicTrafficGrowth", label: "Organic Traffic Growth", suffix: "%" },
  { key: "keywordGrowth", label: "Keyword Growth" },
];

export default async function CaseStudyDetailPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <>
      <Breadcrumbs items={[{ name: "Case Studies", path: "/case-studies" }, { name: cs.title, path: `/case-studies/${cs.slug}` }]} />
      <section className="container-page max-w-3xl pb-16">
        <h1 className="text-4xl font-bold tracking-tight">{cs.title}</h1>
        <p className="mt-2 text-muted">
          {cs.clientName} {cs.industry && `· ${cs.industry}`} {cs.timeline && `· ${cs.timeline}`}
        </p>

        {cs.servicesUsed.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {cs.servicesUsed.map((s) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
          </div>
        )}

        {cs.challenge && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Challenge</h2>
            <p className="mt-2 text-muted">{cs.challenge}</p>
          </div>
        )}
        {cs.strategy && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Strategy</h2>
            <p className="mt-2 text-muted">{cs.strategy}</p>
          </div>
        )}
        {cs.execution && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Execution</h2>
            <p className="mt-2 text-muted">{cs.execution}</p>
          </div>
        )}

        {cs.resultsVerified ? (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Results</h2>
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {METRICS.filter((m) => cs[m.key] !== null && cs[m.key] !== undefined).map((m) => (
                <div key={m.label} className="rounded-2xl border border-border p-4 text-center">
                  <p className="text-2xl font-bold">
                    {m.suffix === "₹" ? "₹" : ""}
                    {String(cs[m.key])}
                    {m.suffix && m.suffix !== "₹" ? m.suffix : ""}
                  </p>
                  <p className="text-xs text-muted">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">Results for this project are pending client verification.</p>
        )}

        {cs.testimonial && (
          <div className="mt-8 rounded-2xl border border-border p-5">
            <p className="text-sm">&ldquo;{cs.testimonial.review}&rdquo;</p>
            <p className="mt-2 text-sm font-semibold">{cs.testimonial.clientName}</p>
          </div>
        )}
      </section>
      <CtaSection />
    </>
  );
}
