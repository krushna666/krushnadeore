import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/blog/tag/[slug]">) {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) return {};
  return buildMetadata({
    title: `#${tag.name} Articles | OlyxMedia Blog`,
    description: `Articles tagged ${tag.name} from OlyxMedia.`,
    path: `/blog/tag/${tag.slug}`,
  });
}

export default async function BlogTagPage({ params }: PageProps<"/blog/tag/[slug]">) {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug }, include: { posts: { where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } } } });
  if (!tag) notFound();

  return (
    <>
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: `#${tag.name}`, path: `/blog/tag/${tag.slug}` }]} />
      <section className="container-page pb-16">
        <h1 className="text-spectrum text-4xl font-bold tracking-tight">#{tag.name}</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tag.posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-2xl border border-border p-5 hover:border-brand">
              <p className="font-semibold">{post.title}</p>
              {post.publishedAt && <p className="mt-2 text-xs text-muted">{formatDate(post.publishedAt)}</p>}
            </Link>
          ))}
        </div>
        {tag.posts.length === 0 && <p className="mt-8 text-sm text-muted">No articles with this tag yet.</p>}
      </section>
    </>
  );
}
