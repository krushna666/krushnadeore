import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Blog | OlyxMedia",
  description: "Digital marketing insights, SEO guides and social media strategy for Indian businesses.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: true },
  });

  return (
    <>
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />
      <section className="container-page pb-16">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-3 max-w-2xl text-muted">Practical digital marketing guidance for Indian businesses.</p>

        {posts.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-2xl border border-border p-5 hover:border-brand">
                {post.category && <Badge variant="outline">{post.category.name}</Badge>}
                <p className="mt-3 font-semibold">{post.title}</p>
                {post.excerpt && <p className="mt-1 text-sm text-muted line-clamp-2">{post.excerpt}</p>}
                <p className="mt-3 text-xs text-muted">
                  {post.publishedAt && formatDate(post.publishedAt)} {post.readingTimeMins && `· ${post.readingTimeMins} min read`}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">New articles are on their way — check back soon.</p>
        )}
      </section>
    </>
  );
}
