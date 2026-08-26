import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE } from "@/lib/constants";

const STATIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/industries",
  "/case-studies",
  "/portfolio",
  "/testimonials",
  "/blog",
  "/contact",
  "/careers",
  "/faq",
  "/pricing",
  "/resources",
  "/glossary",
  "/privacy-policy",
  "/terms-and-conditions",
  "/refund-policy",
  "/cookie-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services, industries, locations, caseStudies, glossaryTerms] = await Promise.all([
    prisma.post.findMany({ where: { status: "PUBLISHED", robotsNoindex: false }, select: { slug: true, updatedAt: true } }),
    prisma.service.findMany({ where: { status: "PUBLISHED", robotsNoindex: false }, select: { slug: true, updatedAt: true } }),
    prisma.industry.findMany({ where: { status: "PUBLISHED", robotsNoindex: false }, select: { slug: true, updatedAt: true } }),
    prisma.location.findMany({ where: { status: "PUBLISHED", robotsNoindex: false }, select: { slug: true, updatedAt: true } }),
    prisma.caseStudy.findMany({ where: { status: "PUBLISHED", robotsNoindex: false }, select: { slug: true, updatedAt: true } }),
    prisma.glossaryTerm.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ]);

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
  }));

  for (const p of posts) entries.push({ url: `${SITE.url}/blog/${p.slug}`, lastModified: p.updatedAt });
  for (const s of services) entries.push({ url: `${SITE.url}/services/${s.slug}`, lastModified: s.updatedAt });
  for (const i of industries) entries.push({ url: `${SITE.url}/industries/${i.slug}`, lastModified: i.updatedAt });
  for (const l of locations) entries.push({ url: `${SITE.url}/${l.slug}`, lastModified: l.updatedAt });
  for (const c of caseStudies) entries.push({ url: `${SITE.url}/case-studies/${c.slug}`, lastModified: c.updatedAt });
  for (const g of glossaryTerms) entries.push({ url: `${SITE.url}/glossary/${g.slug}`, lastModified: g.updatedAt });

  return entries;
}
