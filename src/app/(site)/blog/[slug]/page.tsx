import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { buildMetadata, articleJsonLd, faqJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";
import { JsonLd } from "@/components/marketing/json-ld";
import { ShareButtons } from "@/components/blog/share-buttons";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { extractToc } from "@/lib/toc";

async function getPost(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { author: true, category: true, tags: true, featuredImage: true },
  });
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt || "",
    path: `/blog/${post.slug}`,
    ogImage: post.ogImageUrl || post.featuredImage?.url,
    noindex: post.robotsNoindex,
  });
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { toc, html } = extractToc(post.content);
  const faqs = Array.isArray(post.faqs) ? (post.faqs as { question: string; answer: string }[]) : [];

  const related = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: post.id },
      ...(post.categoryId ? { categoryId: post.categoryId } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          authorName: post.author?.name,
          ogImageUrl: post.ogImageUrl || post.featuredImage?.url,
        })}
      />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />

      <article className="container-page grid gap-10 pb-16 lg:grid-cols-[1fr_260px]">
        <div>
          {post.category && (
            <Link href={`/blog/category/${post.category.slug}`}>
              <Badge variant="outline">{post.category.name}</Badge>
            </Link>
          )}
          <h1 className="mt-3 text-4xl font-bold tracking-tight">{post.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
            {post.author && <span>By {post.author.name}</span>}
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
            {post.readingTimeMins && <span>{post.readingTimeMins} min read</span>}
          </div>

          <div className="prose prose-neutral mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: html }} />

          {post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link key={t.id} href={`/blog/tag/${t.slug}`}>
                  <Badge variant="outline">#{t.name}</Badge>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8">
            <p className="mb-2 text-sm font-medium">Share this article</p>
            <ShareButtons title={post.title} />
          </div>

          {faqs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold">FAQs</h2>
              <div className="mt-3 space-y-3">
                {faqs.map((f, i) => (
                  <details key={i} className="rounded-xl border border-border p-4">
                    <summary className="cursor-pointer font-medium">{f.question}</summary>
                    <p className="mt-2 text-sm text-muted">{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-8">
          {toc.length > 0 && (
            <div className="rounded-2xl border border-border p-4">
              <p className="mb-2 text-sm font-semibold">On this page</p>
              <ul className="space-y-1.5 text-sm">
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
                    <a href={`#${item.id}`} className="text-muted hover:text-brand">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {related.length > 0 && (
            <div className="rounded-2xl border border-border p-4">
              <p className="mb-2 text-sm font-semibold">Related articles</p>
              <ul className="space-y-2 text-sm">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link href={`/blog/${r.slug}`} className="text-brand hover:underline">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </article>

      <CtaSection />
    </>
  );
}
