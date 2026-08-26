import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { AnalyticsScripts } from "@/components/layout/analytics-scripts";

async function getSettings() {
  return prisma.siteSetting.upsert({ where: { id: "singleton" }, update: {}, create: { id: "singleton" } });
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton settings={settings} />
      <MobileBottomNav settings={settings} />
      <CookieConsent />
      <AnalyticsScripts
        ga4Id={settings.ga4Id}
        gtmId={settings.gtmId}
        metaPixelId={settings.metaPixelId}
        clarityId={settings.clarityId}
      />
    </>
  );
}
