import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = buildMetadata({
  title: "Search | OlyxMedia",
  description: "Search OlyxMedia's blog, services and case studies.",
  path: "/search",
  noindex: true,
});

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim();

  const results = query
    ? await prisma.$transaction([
        prisma.post.findMany({
          where: { status: "PUBLISHED", OR: [{ title: { contains: query, mode: "insensitive" } }, { excerpt: { contains: query, mode: "insensitive" } }] },
          take: 10,
        }),
        prisma.service.findMany({ where: { status: "PUBLISHED", name: { contains: query, mode: "insensitive" } }, take: 10 }),
        prisma.caseStudy.findMany({ where: { status: "PUBLISHED", title: { contains: query, mode: "insensitive" } }, take: 10 }),
      ])
    : [[], [], []];

  const [posts, services, caseStudies] = results;
  const totalResults = posts.length + services.length + caseStudies.length;

  return (
    <>
      <Breadcrumbs items={[{ name: "Search", path: "/search" }]} />
      <section className="container-page max-w-2xl pb-16">
        <h1 className="text-4xl font-bold tracking-tight">Search</h1>
        <form className="mt-6 flex gap-2">
          <Input name="q" defaultValue={query} placeholder="Search blog, services, case studies…" />
          <Button type="submit">Search</Button>
        </form>

        {query && (
          <div className="mt-8 space-y-8">
            <p className="text-sm text-muted">{totalResults} result(s) for &ldquo;{query}&rdquo;</p>
            {posts.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold">Blog</p>
                <ul className="space-y-2">
                  {posts.map((p) => (
                    <li key={p.id}>
                      <Link href={`/blog/${p.slug}`} className="text-brand hover:underline">
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {services.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold">Services</p>
                <div className="flex flex-wrap gap-2">
                  {services.map((s) => (
                    <Link key={s.id} href={`/services/${s.slug}`}>
                      <Badge variant="outline">{s.name}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {caseStudies.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold">Case Studies</p>
                <ul className="space-y-2">
                  {caseStudies.map((cs) => (
                    <li key={cs.id}>
                      <Link href={`/case-studies/${cs.slug}`} className="text-brand hover:underline">
                        {cs.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
