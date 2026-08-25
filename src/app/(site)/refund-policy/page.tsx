import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Refund Policy | OlyxMedia",
  description: "OlyxMedia refund policy.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Refund Policy", path: "/refund-policy" }]} />
      <section className="container-page prose prose-neutral max-w-3xl pb-16">
        <h1>Refund Policy</h1>
        <p className="text-sm text-muted">Last updated: [Add date when finalized]</p>
        <p>[Placeholder — specify refund eligibility for retainer/project payments, cancellation notice periods, and any non-refundable costs (e.g. ad spend already deployed).]</p>
        <h2>Ad spend</h2>
        <p>Amounts paid directly to ad platforms (Google Ads, Meta Ads, etc.) on your behalf are non-refundable once spent.</p>
        <h2>Contact</h2>
        <p>
          For refund requests, contact <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
        <p className="text-sm text-muted">This is a placeholder. Replace with terms specific to your contracts before going live.</p>
      </section>
    </>
  );
}
