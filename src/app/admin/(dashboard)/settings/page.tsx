import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveSettingsAction } from "./actions";

export const metadata = { title: "Settings | OlyxMedia Admin" };

export default async function SettingsPage() {
  const settings = await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Site Settings</h1>
      <form action={saveSettingsAction} className="space-y-6">
        <section className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-2">
          <h3 className="font-semibold sm:col-span-2">Business Info</h3>
          <Input name="businessName" placeholder="Business name" defaultValue={settings.businessName} />
          <Input name="phone" placeholder="Phone" defaultValue={settings.phone} />
          <Input name="email" placeholder="Email" defaultValue={settings.email} />
          <Input name="address" placeholder="Address" defaultValue={settings.address} />
          <Input name="logoUrl" placeholder="Logo URL" defaultValue={settings.logoUrl || ""} />
          <Input name="faviconUrl" placeholder="Favicon URL" defaultValue={settings.faviconUrl || ""} />
        </section>

        <section className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-2">
          <h3 className="font-semibold sm:col-span-2">Social &amp; Contact</h3>
          <Input name="instagramUrl" placeholder="Instagram URL" defaultValue={settings.instagramUrl || ""} />
          <Input name="facebookUrl" placeholder="Facebook URL" defaultValue={settings.facebookUrl || ""} />
          <Input name="linkedinUrl" placeholder="LinkedIn URL" defaultValue={settings.linkedinUrl || ""} />
          <Input name="youtubeUrl" placeholder="YouTube URL" defaultValue={settings.youtubeUrl || ""} />
          <Input name="whatsappNumber" placeholder="WhatsApp number (no +, e.g. 917559191116)" defaultValue={settings.whatsappNumber} />
          <Input name="whatsappDefaultMessage" placeholder="WhatsApp default message" defaultValue={settings.whatsappDefaultMessage} />
          <Textarea name="googleMapsEmbedUrl" placeholder="Google Maps embed URL" defaultValue={settings.googleMapsEmbedUrl || ""} className="sm:col-span-2" rows={2} />
        </section>

        <section className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-2">
          <h3 className="font-semibold sm:col-span-2">Analytics &amp; Tracking</h3>
          <Input name="ga4Id" placeholder="Google Analytics 4 ID" defaultValue={settings.ga4Id || ""} />
          <Input name="gtmId" placeholder="Google Tag Manager ID" defaultValue={settings.gtmId || ""} />
          <Input name="metaPixelId" placeholder="Meta Pixel ID" defaultValue={settings.metaPixelId || ""} />
          <Input name="clarityId" placeholder="Microsoft Clarity ID" defaultValue={settings.clarityId || ""} />
          <Input name="searchConsoleVerification" placeholder="Search Console verification code" defaultValue={settings.searchConsoleVerification || ""} className="sm:col-span-2" />
        </section>

        <section className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-2">
          <h3 className="font-semibold sm:col-span-2">Default SEO</h3>
          <Input name="defaultSeoTitle" placeholder="Default SEO title" defaultValue={settings.defaultSeoTitle} className="sm:col-span-2" />
          <Textarea name="defaultSeoDescription" placeholder="Default meta description" defaultValue={settings.defaultSeoDescription} className="sm:col-span-2" rows={2} />
          <Input name="defaultOgImageUrl" placeholder="Default OG image URL" defaultValue={settings.defaultOgImageUrl || ""} className="sm:col-span-2" />
        </section>

        <Button type="submit">Save settings</Button>
      </form>
    </div>
  );
}
