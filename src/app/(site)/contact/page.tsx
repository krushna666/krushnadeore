import { prisma } from "@/lib/db";
import { buildMetadata, localBusinessJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { JsonLd } from "@/components/marketing/json-ld";
import { LeadForm } from "@/components/marketing/lead-form";
import { whatsappUrl } from "@/lib/constants";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata = buildMetadata({
  title: "Contact OlyxMedia | Social Media & Digital Marketing Agency in Pune",
  description: "Get in touch with OlyxMedia — Baner, Pune. Call, WhatsApp, email or book a free strategy call.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await prisma.siteSetting.upsert({ where: { id: "singleton" }, update: {}, create: { id: "singleton" } });

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <section className="container-page grid gap-10 pb-16 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
          <p className="mt-3 text-muted">Tell us about your business and we&apos;ll get back to you within one business day.</p>

          <div className="mt-8 space-y-4 text-sm">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" /> {settings.address}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand" />{" "}
              <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="hover:underline">
                {settings.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand" />{" "}
              <a href={`mailto:${settings.email}`} className="hover:underline">
                {settings.email}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand" /> Mon–Sat, 10:00 AM – 7:00 PM IST
            </p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white"
            >
              Chat on WhatsApp
            </a>
          </div>

          {settings.googleMapsEmbedUrl ? (
            <iframe
              src={settings.googleMapsEmbedUrl}
              className="mt-8 h-72 w-full rounded-2xl border border-border"
              loading="lazy"
              title="OlyxMedia location"
            />
          ) : (
            <div className="mt-8 flex h-72 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted">
              Map embed not configured — add one in Admin → Settings.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border p-6">
          <LeadForm />
        </div>
      </section>
    </>
  );
}
