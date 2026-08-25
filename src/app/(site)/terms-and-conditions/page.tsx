import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Terms & Conditions | OlyxMedia",
  description: "OlyxMedia terms and conditions.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Terms & Conditions", path: "/terms-and-conditions" }]} />
      <section className="container-page prose prose-neutral max-w-3xl pb-16">
        <h1>Terms &amp; Conditions</h1>
        <p className="text-sm text-muted">Last updated: [Add date when finalized]</p>
        <p>These terms govern your use of the {SITE.name} website and services.</p>
        <h2>Services</h2>
        <p>[Placeholder — describe engagement terms, scope of services, and that specific deliverables are agreed per project/contract.]</p>
        <h2>No guaranteed results</h2>
        <p>
          Digital marketing results depend on many factors outside our control (platform algorithms, market
          conditions, budget, etc.). We do not guarantee specific rankings, traffic, leads or revenue outcomes.
        </p>
        <h2>Intellectual property</h2>
        <p>[Placeholder — describe ownership of creative assets, website content, and client-provided materials.]</p>
        <h2>Limitation of liability</h2>
        <p>[Placeholder — standard limitation-of-liability clause, reviewed by legal counsel.]</p>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws of India.</p>
        <h2>Contact</h2>
        <p>
          Questions can be sent to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
        <p className="text-sm text-muted">
          This is a placeholder. Replace bracketed sections with terms reviewed for your specific business before
          going live.
        </p>
      </section>
    </>
  );
}
