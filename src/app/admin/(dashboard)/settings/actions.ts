"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();

  const data = {
    businessName: (formData.get("businessName") as string) || "OlyxMedia",
    phone: (formData.get("phone") as string) || "",
    email: (formData.get("email") as string) || "",
    address: (formData.get("address") as string) || "",
    logoUrl: (formData.get("logoUrl") as string) || null,
    faviconUrl: (formData.get("faviconUrl") as string) || null,
    instagramUrl: (formData.get("instagramUrl") as string) || null,
    facebookUrl: (formData.get("facebookUrl") as string) || null,
    linkedinUrl: (formData.get("linkedinUrl") as string) || null,
    youtubeUrl: (formData.get("youtubeUrl") as string) || null,
    googleMapsEmbedUrl: (formData.get("googleMapsEmbedUrl") as string) || null,
    whatsappNumber: (formData.get("whatsappNumber") as string) || "917559191116",
    whatsappDefaultMessage: (formData.get("whatsappDefaultMessage") as string) || "",
    ga4Id: (formData.get("ga4Id") as string) || null,
    gtmId: (formData.get("gtmId") as string) || null,
    metaPixelId: (formData.get("metaPixelId") as string) || null,
    clarityId: (formData.get("clarityId") as string) || null,
    searchConsoleVerification: (formData.get("searchConsoleVerification") as string) || null,
    defaultSeoTitle: (formData.get("defaultSeoTitle") as string) || "",
    defaultSeoDescription: (formData.get("defaultSeoDescription") as string) || "",
    defaultOgImageUrl: (formData.get("defaultOgImageUrl") as string) || null,
  };

  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
