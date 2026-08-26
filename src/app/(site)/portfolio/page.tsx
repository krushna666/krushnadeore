import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";
import { Badge } from "@/components/ui/badge";
import type { Prisma, PortfolioCategory } from "@prisma/client";

export const metadata = buildMetadata({
  title: "Portfolio | OlyxMedia",
  description: "Explore OlyxMedia's work across social media, branding, reels, graphic design, websites, SEO and paid ads.",
  path: "/portfolio",
});

const CATEGORIES = ["SOCIAL_MEDIA", "BRANDING", "REELS", "GRAPHIC_DESIGN", "WEBSITES", "SEO", "PAID_ADS", "CAMPAIGNS"] as const;

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const where: Prisma.PortfolioWhereInput = {
    status: "PUBLISHED",
    ...(category && CATEGORIES.includes(category as PortfolioCategory) ? { category: category as PortfolioCategory } : {}),
  };
  const items = await prisma.portfolio.findMany({ where, orderBy: { order: "asc" } });

  return (
    <>
      <Breadcrumbs items={[{ name: "Portfolio", path: "/portfolio" }]} />
      <section className="container-page pb-16">
        <h1 className="text-4xl font-bold tracking-tight">Portfolio</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/portfolio">
            <Badge variant={!category ? "default" : "outline"}>All</Badge>
          </Link>
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/portfolio?category=${c}`}>
              <Badge variant={category === c ? "default" : "outline"}>{c.replace("_", " ")}</Badge>
            </Link>
          ))}
        </div>

        {items.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <div key={p.id} className="rounded-2xl border border-border p-5">
                <Badge variant="outline">{p.category.replace("_", " ")}</Badge>
                <p className="mt-3 font-semibold">{p.title}</p>
                <p className="mt-1 text-sm text-muted">{p.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">Portfolio items coming soon in this category.</p>
        )}
      </section>
      <CtaSection />
    </>
  );
}
