import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Privacy Policy | OlyxMedia",
  description: "OlyxMedia privacy policy.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Privacy Policy", path: "/privacy-policy" }]} />
      <section className="container-page prose prose-neutral max-w-3xl pb-16">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-muted">Last updated: [Add date when finalized]</p>
        <p>
          This Privacy Policy explains how {SITE.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses and
          protects information you share with us through this website, including via contact forms, newsletter
          sign-ups and cookies.
        </p>
        <h2>Information we collect</h2>
        <p>
          [Placeholder — specify exactly what personal data is collected: name, email, phone, company, form
          submissions, cookies/analytics identifiers, etc.]
        </p>
        <h2>How we use information</h2>
        <p>[Placeholder — describe use for responding to enquiries, providing services, and marketing communications where consented.]</p>
        <h2>Cookies</h2>
        <p>
          See our <Link href="/cookie-policy">Cookie Policy</Link> for details on the cookies we use and how to manage
          your preferences.
        </p>
        <h2>Data sharing</h2>
        <p>[Placeholder — list any third-party processors, e.g. email/SMTP provider, analytics providers, hosting provider.]</p>
        <h2>Your rights</h2>
        <p>[Placeholder — describe how users can request access, correction or deletion of their data.]</p>
        <h2>Contact</h2>
        <p>
          Questions about this policy can be sent to{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
        <p className="text-sm text-muted">
          This is a placeholder policy. Replace bracketed sections with legal copy reviewed for your specific
          business before going live.
        </p>
      </section>
    </>
  );
}
