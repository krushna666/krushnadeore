import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/blog/category/[slug]">) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return buildMetadata({
    title: `${category.name} Articles | OlyxMedia Blog`,
    description: category.description || `Articles about ${category.name} from OlyxMedia.`,
    path: `/blog/category/${category.slug}`,
  });
}

export default async function BlogCategoryPage({ params }: PageProps<"/blog/category/[slug]">) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", categoryId: category.id },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: category.name, path: `/blog/category/${category.slug}` }]} />
      <section className="container-page pb-16">
        <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-2xl border border-border p-5 hover:border-brand">
              <p className="font-semibold">{post.title}</p>
              {post.publishedAt && <p className="mt-2 text-xs text-muted">{formatDate(post.publishedAt)}</p>}
            </Link>
          ))}
        </div>
        {posts.length === 0 && <p className="mt-8 text-sm text-muted">No articles in this category yet.</p>}
      </section>
    </>
  );
}
