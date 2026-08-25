"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

function lines(formData: FormData, key: string): string[] {
  return ((formData.get(key) as string) || "").split("\n").map((s) => s.trim()).filter(Boolean);
}

export async function saveIndustryAction(formData: FormData) {
  await requireUser();
  const id = (formData.get("id") as string) || undefined;
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;

  const data = {
    name,
    slug: slugify((formData.get("slug") as string) || name),
    challenges: (formData.get("challenges") as string) || null,
    solution: (formData.get("solution") as string) || null,
    recommendedServices: lines(formData, "recommendedServices"),
    contentStrategy: (formData.get("contentStrategy") as string) || null,
    leadGenStrategy: (formData.get("leadGenStrategy") as string) || null,
    seoStrategy: (formData.get("seoStrategy") as string) || null,
    status: (formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as "PUBLISHED" | "DRAFT",
    seoTitle: (formData.get("seoTitle") as string) || null,
    metaDescription: (formData.get("metaDescription") as string) || null,
  };

  if (id) {
    await prisma.industry.update({ where: { id }, data });
  } else {
    await prisma.industry.create({ data });
  }
  revalidatePath("/admin/industries");
  revalidatePath("/industries");
}

export async function deleteIndustryAction(id: string) {
  await requireUser();
  await prisma.industry.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/industries");
}
