import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";

export const metadata = buildMetadata({
  title: "Cookie Policy | OlyxMedia",
  description: "How OlyxMedia uses cookies.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Cookie Policy", path: "/cookie-policy" }]} />
      <section className="container-page prose prose-neutral max-w-3xl pb-16">
        <h1>Cookie Policy</h1>
        <p>We use three categories of cookies on this site:</p>
        <h2>Necessary</h2>
        <p>Required for the site to function (e.g. remembering your cookie preference). Always on.</p>
        <h2>Analytics</h2>
        <p>Help us understand how visitors use the site (e.g. Google Analytics, Microsoft Clarity). Only loaded with your consent.</p>
        <h2>Marketing</h2>
        <p>Used for ad targeting and measurement (e.g. Meta Pixel). Only loaded with your consent.</p>
        <p>
          You can change your preference at any time by clearing this site&apos;s cookies in your browser and
          reloading, which will show the consent banner again.
        </p>
      </section>
    </>
  );
}
