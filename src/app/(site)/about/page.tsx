import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";
import { BarChart3, Compass, Lightbulb, Rocket, SlidersHorizontal, Sparkles, TrendingUp } from "lucide-react";

export const metadata = buildMetadata({
  title: "About OlyxMedia | Digital Marketing Agency in Pune",
  description: "OlyxMedia is a Pune-based social media and digital marketing agency focused on measurable business growth.",
  path: "/about",
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

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
      <section className="container-page max-w-3xl pb-16">
        <h1 className="text-4xl font-bold tracking-tight">About OlyxMedia</h1>

        <div className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Who we are</h2>
          <p className="text-muted">
            OlyxMedia is a social media and digital marketing agency based in Baner, Pune. We work with businesses
            that want marketing tied to measurable outcomes — leads, traffic and revenue — not just visibility.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">What we believe</h2>
          <p className="text-muted">
            Marketing should be measurable, honest and built around your actual business goals. We don&apos;t
            promise guaranteed rankings or overnight virality — we build systems that compound over time.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">How we work</h2>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {PROCESS.map(({ label, icon: Icon }) => (
              <div key={label} className="group rounded-xl border border-border bg-background p-3 text-center transition duration-300 hover:-translate-y-1 hover:border-brand hover:bg-brand hover:text-white">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-brand text-brand transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-brand">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <p className="mt-2 text-sm font-medium transition-colors duration-300 group-hover:text-white">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Why businesses choose us</h2>
          <ul className="list-inside list-disc space-y-1 text-muted">
            <li>Transparent process with monthly reporting</li>
            <li>Dedicated strategist for every account</li>
            <li>Pune-based team that understands the Indian market</li>
            <li>Performance tracking tied to real business goals</li>
          </ul>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
