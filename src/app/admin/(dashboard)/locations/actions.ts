"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

function lines(formData: FormData, key: string): string[] {
  return ((formData.get(key) as string) || "").split("\n").map((s) => s.trim()).filter(Boolean);
}

export async function saveLocationAction(formData: FormData) {
  await requireUser();
  const id = (formData.get("id") as string) || undefined;
  const name = (formData.get("name") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  if (!name || !city) return;

  const data = {
    name,
    slug: slugify((formData.get("slug") as string) || name),
    city,
    region: (formData.get("region") as string) || "Maharashtra",
    intro: (formData.get("intro") as string) || null,
    localProblems: (formData.get("localProblems") as string) || null,
    servicesOffered: lines(formData, "servicesOffered"),
    industriesServed: lines(formData, "industriesServed"),
    processContent: (formData.get("processContent") as string) || null,
    status: (formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as "PUBLISHED" | "DRAFT",
    seoTitle: (formData.get("seoTitle") as string) || null,
    metaDescription: (formData.get("metaDescription") as string) || null,
  };

  if (id) {
    await prisma.location.update({ where: { id }, data });
  } else {
    await prisma.location.create({ data });
  }
  revalidatePath("/admin/locations");
}

export async function deleteLocationAction(id: string) {
  await requireUser();
  await prisma.location.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/locations");
}
