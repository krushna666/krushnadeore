"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

function lines(formData: FormData, key: string): string[] {
  return ((formData.get(key) as string) || "").split("\n").map((s) => s.trim()).filter(Boolean);
}

export async function saveServiceAction(formData: FormData) {
  await requireUser();
  const id = (formData.get("id") as string) || undefined;
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;

  const data = {
    name,
    slug: slugify((formData.get("slug") as string) || name),
    shortDescription: (formData.get("shortDescription") as string) || null,
    headline: (formData.get("headline") as string) || null,
    problem: (formData.get("problem") as string) || null,
    solution: (formData.get("solution") as string) || null,
    deliverables: lines(formData, "deliverables"),
    process: lines(formData, "process"),
    benefits: lines(formData, "benefits"),
    idealClient: (formData.get("idealClient") as string) || null,
    status: (formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as "PUBLISHED" | "DRAFT",
    seoTitle: (formData.get("seoTitle") as string) || null,
    metaDescription: (formData.get("metaDescription") as string) || null,
  };

  if (id) {
    await prisma.service.update({ where: { id }, data });
  } else {
    await prisma.service.create({ data });
  }
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function deleteServiceAction(id: string) {
  await requireUser();
  await prisma.service.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/services");
}
