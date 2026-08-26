import { cache } from "react";
import type { SiteSetting } from "@prisma/client";
import { prisma } from "@/lib/db";

const DEFAULT_SITE_SETTINGS: SiteSetting = {
  id: "singleton",
  businessName: "OlyxMedia",
  phone: "+91 7559191116",
  email: "support@olyxmedia.com",
  address: "Baner, Pune, Maharashtra, India",
  logoUrl: null,
  faviconUrl: null,
  instagramUrl: null,
  facebookUrl: null,
  linkedinUrl: null,
  youtubeUrl: null,
  googleMapsEmbedUrl: null,
  whatsappNumber: "917559191116",
  whatsappDefaultMessage: "Hi OlyxMedia, I want to discuss digital marketing for my business.",
  ga4Id: null,
  gtmId: null,
  metaPixelId: null,
  clarityId: null,
  searchConsoleVerification: null,
  defaultSeoTitle: "Social Media Marketing Agency in Pune | OlyxMedia",
  defaultSeoDescription:
    "OlyxMedia is a Pune-based social media and digital marketing agency helping businesses grow through social media, SEO, paid advertising, content and lead generation.",
  defaultOgImageUrl: null,
  updatedAt: new Date(0),
};

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  try {
    const settings = await prisma.siteSetting.findUnique({ where: { id: "singleton" } });
    return settings ?? { ...DEFAULT_SITE_SETTINGS };
  } catch {
    return { ...DEFAULT_SITE_SETTINGS };
  }
});
