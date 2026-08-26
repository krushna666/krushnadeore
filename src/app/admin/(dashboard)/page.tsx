import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = { title: "Dashboard | OlyxMedia Admin" };

async function getStats() {
  const [
    totalLeads,
    newLeads,
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalTestimonials,
    portfolioItems,
    caseStudies,
    newsletterSubscribers,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.testimonial.count(),
    prisma.portfolio.count(),
    prisma.caseStudy.count(),
    prisma.newsletterSubscriber.count({ where: { status: "ACTIVE" } }),
  ]);

  return {
    totalLeads,
    newLeads,
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalTestimonials,
    portfolioItems,
    caseStudies,
    newsletterSubscribers,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const tiles: { label: string; value: number; href: string }[] = [
    { label: "Total Leads", value: stats.totalLeads, href: "/admin/leads" },
    { label: "New Leads", value: stats.newLeads, href: "/admin/leads" },
    { label: "Total Blogs", value: stats.totalBlogs, href: "/admin/blogs" },
    { label: "Published Blogs", value: stats.publishedBlogs, href: "/admin/blogs" },
    { label: "Draft Blogs", value: stats.draftBlogs, href: "/admin/blogs" },
    { label: "Testimonials", value: stats.totalTestimonials, href: "/admin/testimonials" },
    { label: "Portfolio Items", value: stats.portfolioItems, href: "/admin/portfolio" },
    { label: "Case Studies", value: stats.caseStudies, href: "/admin/case-studies" },
    { label: "Newsletter Subscribers", value: stats.newsletterSubscribers, href: "/admin/newsletter" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href}>
            <Card className="transition hover:border-brand">
              <CardHeader>
                <CardTitle className="text-3xl">{tile.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted">{tile.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
