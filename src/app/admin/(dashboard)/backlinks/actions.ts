"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import type { BacklinkStatus } from "@prisma/client";

export async function createBacklinkAction(formData: FormData) {
  await requireUser();
  const website = (formData.get("website") as string)?.trim();
  if (!website) return;

  let domain = website;
  try {
    domain = new URL(website.startsWith("http") ? website : `https://${website}`).hostname;
  } catch {
    // keep raw input if URL parsing fails
  }

  await prisma.backlink.create({
    data: {
      website,
      domain,
      contactName: (formData.get("contactName") as string) || null,
      email: (formData.get("email") as string) || null,
      category: (formData.get("category") as string) || null,
      authority: formData.get("authority") ? Number(formData.get("authority")) : null,
      status: (formData.get("status") as BacklinkStatus) || "PROSPECT",
      notes: (formData.get("notes") as string) || null,
    },
  });
  revalidatePath("/admin/backlinks");
}

export async function updateBacklinkStatusAction(id: string, formData: FormData) {
  await requireUser();
  await prisma.backlink.update({
    where: { id },
    data: {
      status: formData.get("status") as BacklinkStatus,
      linkUrl: (formData.get("linkUrl") as string) || null,
      anchorText: (formData.get("anchorText") as string) || null,
      response: (formData.get("response") as string) || null,
      outreachDate: formData.get("status") !== "PROSPECT" ? new Date() : undefined,
    },
  });
  revalidatePath("/admin/backlinks");
}

export async function deleteBacklinkAction(id: string) {
  await requireUser();
  await prisma.backlink.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/backlinks");
}
