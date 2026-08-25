import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = { title: "SEO Dashboard | OlyxMedia Admin" };

export default async function SeoDashboardPage() {
  const [
    publishedPosts,
    postsMissingMeta,
    publishedServices,
    servicesMissingMeta,
    publishedLocations,
    redirectCount,
    noindexCount,
  ] = await Promise.all([
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.findMany({
      where: { status: "PUBLISHED", OR: [{ seoTitle: null }, { metaDescription: null }] },
      select: { id: true, title: true, slug: true },
    }),
    prisma.service.count({ where: { status: "PUBLISHED" } }),
    prisma.service.findMany({
      where: { status: "PUBLISHED", OR: [{ seoTitle: null }, { metaDescription: null }] },
      select: { id: true, name: true, slug: true },
    }),
    prisma.location.count({ where: { status: "PUBLISHED" } }),
    prisma.redirect.count(),
    prisma.post.count({ where: { robotsNoindex: true } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">SEO Dashboard</h1>
      <p className="text-sm text-muted">
        An internal content-quality check — not a replacement for Google Search Console.{" "}
        <Link href="/sitemap.xml" className="text-brand hover:underline">
          View sitemap.xml
        </Link>{" "}
        ·{" "}
        <Link href="/robots.txt" className="text-brand hover:underline">
          View robots.txt
        </Link>
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Published posts", value: publishedPosts },
          { label: "Published services", value: publishedServices },
          { label: "Published locations", value: publishedLocations },
          { label: "Active redirects", value: redirectCount },
          { label: "Noindex posts", value: noindexCount },
        ].map((t) => (
          <div key={t.label} className="rounded-2xl border border-border p-4">
            <p className="text-2xl font-semibold">{t.value}</p>
            <p className="text-xs text-muted">{t.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border p-4">
        <h3 className="mb-3 font-semibold">
          Published posts missing SEO title/description <Badge variant="warning">{postsMissingMeta.length}</Badge>
        </h3>
        {postsMissingMeta.length === 0 ? (
          <p className="text-sm text-muted">None — nice work.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {postsMissingMeta.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/blogs/${p.id}/edit`} className="text-brand hover:underline">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-border p-4">
        <h3 className="mb-3 font-semibold">
          Published services missing SEO title/description <Badge variant="warning">{servicesMissingMeta.length}</Badge>
        </h3>
        {servicesMissingMeta.length === 0 ? (
          <p className="text-sm text-muted">None — nice work.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {servicesMissingMeta.map((s) => (
              <li key={s.id}>{s.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
