import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeadForm } from "@/components/marketing/lead-form";
import { JsonLd } from "@/components/marketing/json-ld";
import { buildMetadata, organizationJsonLd, localBusinessJsonLd, websiteJsonLd, faqJsonLd } from "@/lib/seo";
import { SITE, whatsappUrl } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { ArrowDown, ArrowRight, BarChart3, Compass, GitBranch, Lightbulb, Mail, MessageCircle, Phone, Rocket, SlidersHorizontal, Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";

export const metadata = buildMetadata({
  title: "Social Media Marketing Agency in Pune | OlyxMedia",
  description: SITE.description,
  path: "/",
});

const PROCESS = [
  { label: "Discover", icon: Compass },
  { label: "Strategy", icon: Lightbulb },
  { label: "Create", icon: Sparkles },
  { label: "Launch", icon: Rocket },
  { label: "Measure", icon: BarChart3 },
  { label: "Optimize", icon: SlidersHorizontal },
  { label: "Scale", icon: TrendingUp },
];

const WHY_US = [
  "Transparent process with monthly reporting",
  "Dedicated strategist for every account",
  "Pune-based team that understands the Indian market",
  "Performance tracking tied to real business goals",
];

async function getHomeData() {
  const [services, industries, portfolio, caseStudies, testimonials, posts, faqs, clients] = await prisma.$transaction([
    prisma.service.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" }, take: 8 }),
    prisma.industry.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" }, take: 6 }),
    prisma.portfolio.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" }, take: 6 }),
    prisma.caseStudy.findMany({ where: { status: "PUBLISHED" }, orderBy: { updatedAt: "desc" }, take: 3 }),
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.post.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.fAQ.findMany({ where: { published: true, pageSlug: "home" }, orderBy: { order: "asc" }, take: 8 }),
    prisma.client.findMany({ where: { published: true, verified: true }, orderBy: { order: "asc" }, include: { logo: true }, take: 12 }),
  ]);
  return { services, industries, portfolio, caseStudies, testimonials, posts, faqs, clients };
}

export default async function HomePage() {
  const { services, industries, portfolio, caseStudies, testimonials, posts, faqs, clients } = await getHomeData();

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={localBusinessJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))} />}

      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="container-page grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div className="animate-fade-up">
            <Badge className="border-white/20 bg-white/10 text-white">Baner, Pune, Maharashtra</Badge>
            <h1 className="mt-4 text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
              Social Media Marketing Agency in Pune That Drives <span className="text-accent">Real Business Growth</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              OlyxMedia helps ambitious businesses build stronger brands, generate qualified leads and turn social
              media attention into measurable growth.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact">
                <Button size="lg" variant="accent">
                  Book a Free Strategy Call
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  View Our Work
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-white/70">
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white">
                <MessageCircle className="h-4 w-4" /> WhatsApp us
              </a>
              <a href={SITE.phoneHref} className="flex items-center gap-1.5 hover:text-white">
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 hover:text-white">
                <Mail className="h-4 w-4" /> {SITE.email}
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="mb-4 text-sm font-medium text-white/70">Get a free growth plan</p>
            <div className="rounded-xl bg-white p-4 text-ink">
              <LeadForm compact />
            </div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="border-b border-white/10 bg-ink text-white">
        <div className="container-page grid grid-cols-2 gap-6 py-8 text-center text-sm font-medium text-white/80 sm:grid-cols-4">
          {WHY_US.map((w) => (
            <p key={w}>{w}</p>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="container-page py-16">
        <h2 className="text-3xl font-bold tracking-tight">What We Do</h2>
        <p className="mt-2 max-w-2xl text-muted">
          A full-stack digital marketing partner — from social media and content to SEO, paid media and lead
          generation.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Social Media Marketing", href: "/social-media-marketing" },
            { title: "SEO & Local SEO", href: "/seo" },
            { title: "Performance Marketing", href: "/performance-marketing" },
            { title: "Branding & Design", href: "/branding" },
          ].map((p) => (
            <Link key={p.href} href={p.href} className="group rounded-2xl border border-border p-5 transition hover:border-brand">
              <p className="font-semibold">{p.title}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand opacity-0 transition group-hover:opacity-100">
                Learn more <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section className="bg-surface py-16">
          <div className="container-page">
            <h2 className="text-3xl font-bold tracking-tight">Services</h2>
            <div className="relative mt-8">
              <div className="mx-auto flex w-fit flex-col items-center">
                <div className="flex items-center gap-2 rounded-full border border-brand bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground shadow-sm">
                  <GitBranch className="h-4 w-4" aria-hidden="true" /> Growth strategy
                </div>
                <ArrowDown className="mt-2 h-5 w-5 text-brand" aria-hidden="true" />
              </div>
              <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, index) => (
                <Link key={s.id} href={`/services/${s.slug}`} className="group relative rounded-2xl border border-border bg-background p-5 transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-lg">
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-brand bg-brand-soft text-sm font-bold text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="font-semibold">{s.name}</p>
                  <p className="mt-1 text-sm text-muted">{s.shortDescription}</p>
                  <span className="mt-4 flex items-center gap-1 text-sm font-medium text-brand opacity-0 transition duration-300 group-hover:opacity-100">
                    Next step <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="pointer-events-none absolute -top-4 left-1/2 hidden h-4 w-px bg-brand/50 lg:block" aria-hidden="true" />
                </Link>
              ))}
              </div>
            </div>
            <div className="mt-8">
              <Link href="/services" className="text-sm font-medium text-brand hover:underline">
                View all services →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="bg-ink py-16 text-white">
        <div className="container-page">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/60">How we move</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Our Process</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {PROCESS.map(({ label, icon: Icon }) => (
            <div key={label} className="group rounded-xl border border-white/15 bg-white/[0.04] p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-accent text-accent transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-accent">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm font-medium text-white/80 transition-colors duration-300 group-hover:text-white">{label}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Industries */}
      {industries.length > 0 && (
        <section className="bg-surface py-16">
          <div className="container-page">
            <h2 className="text-3xl font-bold tracking-tight">Industries We Serve</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {industries.map((ind) => (
                <Link key={ind.id} href={`/industries/${ind.slug}`}>
                  <Badge variant="outline" className="px-4 py-2 text-sm hover:border-brand">
                    {ind.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      {clients.length > 0 && (
        <section className="bg-surface py-16">
          <div className="container-page">
            <h2 className="text-3xl font-bold tracking-tight">Our Clients</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {clients.map((client) => {
                const content = (
                  <div className="flex min-h-28 items-center justify-center rounded-xl border border-border bg-background p-5 transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-lg">
                    {client.logo ? (
                      <Image src={client.logo.url} alt={client.logo.alt || `${client.companyName} logo`} width={140} height={72} className="max-h-14 max-w-full w-auto object-contain grayscale transition duration-300 hover:grayscale-0" unoptimized />
                    ) : (
                      <span className="text-center text-sm font-medium">{client.companyName}</span>
                    )}
                  </div>
                );
                return client.website ? (
                  <a key={client.id} href={client.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${client.companyName}`}>
                    {content}
                  </a>
                ) : <div key={client.id}>{content}</div>;
              })}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio */}
      <section className="container-page py-16">
        <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
        {portfolio.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((p) => (
              <div key={p.id} className="rounded-2xl border border-border p-5">
                <Badge variant="outline">{p.category.replace("_", " ")}</Badge>
                <p className="mt-3 font-semibold">{p.title}</p>
                <p className="mt-1 text-sm text-muted">{p.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Portfolio case studies coming soon.</p>
        )}
      </section>

      {/* Case studies */}
      <section className="bg-surface py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold tracking-tight">Case Studies</h2>
          {caseStudies.length > 0 ? (
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {caseStudies.map((cs) => (
                <Link key={cs.id} href={`/case-studies/${cs.slug}`} className="rounded-2xl border border-border bg-background p-5 hover:border-brand">
                  <p className="font-semibold">{cs.title}</p>
                  <p className="mt-1 text-sm text-muted">{cs.clientName}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Case study coming soon — real client results, verified before publishing.</p>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page py-16">
        <h2 className="text-3xl font-bold tracking-tight">What Clients Say</h2>
        {testimonials.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-2xl border border-border p-5">
                <p className="text-sm">&ldquo;{t.review}&rdquo;</p>
                <p className="mt-3 text-sm font-semibold">{t.clientName}</p>
                <p className="text-xs text-muted">
                  {t.designation}
                  {t.company ? `, ${t.company}` : ""}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Client testimonials coming soon.</p>
        )}
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="bg-surface py-16">
          <div className="container-page">
            <h2 className="text-spectrum text-3xl font-bold tracking-tight">From the Blog</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-2xl border border-border bg-background p-5 hover:border-brand">
                  <p className="font-semibold">{post.title}</p>
                  {post.publishedAt && <p className="mt-2 text-xs text-muted">{formatDate(post.publishedAt)}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="container-page py-16">
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details key={f.id} className="rounded-2xl border border-border p-4">
                <summary className="cursor-pointer font-medium">{f.question}</summary>
                <p className="mt-2 text-sm text-muted">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-ink py-16 text-white">
        <div className="container-page text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to grow your business?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Book a free strategy call and get a growth plan tailored to your business.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button size="lg" variant="accent">
                Book a Free Strategy Call
              </Button>
            </Link>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
