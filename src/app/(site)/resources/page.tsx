import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";

export const metadata = buildMetadata({
  title: "Resources | OlyxMedia",
  description: "Guides, templates, checklists and tools for digital marketing.",
  path: "/resources",
});

const SECTIONS = [
  { title: "Guides", href: "/blog", description: "In-depth guides on social media, SEO and digital marketing." },
  { title: "Glossary", href: "/glossary", description: "Plain-English definitions of marketing terms." },
  { title: "FAQs", href: "/faq", description: "Answers to common questions about working with OlyxMedia." },
  { title: "Case Studies", href: "/case-studies", description: "Real, verified client results." },
];

export default function ResourcesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Resources", path: "/resources" }]} />
      <section className="container-page pb-16">
        <h1 className="text-4xl font-bold tracking-tight">Resources</h1>
        <p className="mt-3 max-w-2xl text-muted">Free guides, templates and tools to help you market smarter.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="rounded-2xl border border-border p-5 hover:border-brand">
              <p className="font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
