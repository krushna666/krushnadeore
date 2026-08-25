import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { FOOTER_LINKS } from "@/lib/constants";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { InstagramIcon, FacebookIcon, LinkedInIcon, YouTubeIcon } from "@/components/layout/social-icons";
import type { SiteSetting } from "@prisma/client";

export function Footer({ settings }: { settings: SiteSetting }) {
  const socials = [
    { href: settings.instagramUrl, icon: InstagramIcon, label: "Instagram" },
    { href: settings.facebookUrl, icon: FacebookIcon, label: "Facebook" },
    { href: settings.linkedinUrl, icon: LinkedInIcon, label: "LinkedIn" },
    { href: settings.youtubeUrl, icon: YouTubeIcon, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-24 border-t border-border bg-surface pb-24 md:pb-0">
      <div className="container-page grid gap-10 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          {settings.logoUrl ? (
            <Image src={settings.logoUrl} alt={settings.businessName} width={150} height={44} className="h-10 w-auto object-contain" unoptimized />
          ) : (
            <p className="text-lg font-bold">{settings.businessName}</p>
          )}
          <p className="mt-2 max-w-xs text-sm text-muted">
            Social media, SEO and performance marketing for ambitious businesses in Pune and across India.
          </p>
          <div className="mt-4 space-y-2 text-sm text-muted">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {settings.address}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> <a href={`tel:${settings.phone.replace(/\s+/g, "")}`}>{settings.phone}</a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
          </div>
          {socials.length > 0 && (
            <div className="mt-4 flex gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href!} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-muted hover:text-foreground">
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          )}
        </div>

        <FooterColumn title="Company" links={FOOTER_LINKS.company} />
        <FooterColumn title="Services" links={FOOTER_LINKS.services} />
        <div>
          <FooterColumn title="Resources" links={FOOTER_LINKS.resources} />
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">Newsletter</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted md:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.businessName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {FOOTER_LINKS.legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold">{title}</p>
      <ul className="space-y-2 text-sm text-muted">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
