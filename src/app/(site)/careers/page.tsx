import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Careers | OlyxMedia",
  description: "Careers at OlyxMedia — a Pune-based digital marketing agency.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Careers", path: "/careers" }]} />
      <section className="container-page max-w-2xl pb-24">
        <h1 className="text-4xl font-bold tracking-tight">Careers</h1>
        <p className="mt-4 text-muted">
          We&apos;re not actively hiring right now, but we&apos;re always open to hearing from strong marketers,
          designers and developers based in or willing to work from Pune.
        </p>
        <p className="mt-4 text-muted">
          Send your portfolio and a short note to{" "}
          <a href={`mailto:${SITE.email}`} className="text-brand hover:underline">
            {SITE.email}
          </a>{" "}
          and we&apos;ll reach out if there&apos;s a fit.
        </p>
      </section>
    </>
  );
}
