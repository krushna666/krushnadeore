import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata = buildMetadata({
  title: "Our Services | OlyxMedia",
  description: "Social media marketing, SEO, performance marketing, branding and website development services from OlyxMedia, Pune.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" } });

  return (
    <>
      <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />
      <section className="container-page pb-16">
        <h1 className="text-4xl font-bold tracking-tight">Services</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Performance-focused digital marketing services built for ambitious Indian businesses.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.id} href={`/services/${s.slug}`} className="rounded-2xl border border-border p-5 transition hover:border-brand">
              <p className="font-semibold">{s.name}</p>
              <p className="mt-1 text-sm text-muted">{s.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>
      <CtaSection />
    </>
  );
}
