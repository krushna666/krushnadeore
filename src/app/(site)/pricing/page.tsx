import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const metadata = buildMetadata({
  title: "Pricing | OlyxMedia",
  description: "Transparent, flexible digital marketing packages from OlyxMedia — Starter, Growth, Performance and Custom.",
  path: "/pricing",
});

const PLANS = [
  {
    name: "Starter",
    description: "For small businesses building consistent social presence.",
    features: ["Social media strategy", "Content calendar & production", "Community management", "Monthly reporting"],
  },
  {
    name: "Growth",
    description: "For businesses looking for leads and stronger brand visibility.",
    features: ["Everything in Starter", "SEO foundation", "Paid social campaigns", "Lead capture setup"],
  },
  {
    name: "Performance",
    description: "For businesses focused on measurable acquisition.",
    features: ["Everything in Growth", "Google Ads management", "Landing page optimization", "Conversion tracking & CRO"],
  },
  {
    name: "Custom",
    description: "For larger businesses with multi-channel needs.",
    features: ["Tailored channel mix", "Dedicated strategist", "Custom reporting dashboard", "Priority support"],
  },
];

export default function PricingPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Pricing", path: "/pricing" }]} />
      <section className="container-page pb-16">
        <h1 className="text-4xl font-bold tracking-tight">Pricing</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Transparent packages, scoped to your goals. Every engagement starts with a strategy call — no guaranteed
          results, no inflated promises.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div key={plan.name} className="flex flex-col rounded-2xl border border-border p-6">
              <p className="text-lg font-bold">{plan.name}</p>
              <p className="mt-2 text-sm text-muted">{plan.description}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="mt-6">
                <Button className="w-full">Get Custom Proposal</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
      <CtaSection />
    </>
  );
}
