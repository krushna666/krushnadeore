"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

function num(formData: FormData, key: string) {
  const v = formData.get(key) as string;
  return v ? Number(v) : null;
}

export async function saveCaseStudyAction(formData: FormData) {
  await requireUser();
  const id = (formData.get("id") as string) || undefined;
  const title = (formData.get("title") as string)?.trim();
  const clientName = (formData.get("clientName") as string)?.trim();
  if (!title || !clientName) return;

  const data = {
    title,
    slug: slugify((formData.get("slug") as string) || title),
    clientName,
    industry: (formData.get("industry") as string) || null,
    challenge: (formData.get("challenge") as string) || null,
    strategy: (formData.get("strategy") as string) || null,
    execution: (formData.get("execution") as string) || null,
    servicesUsed: ((formData.get("servicesUsed") as string) || "").split(",").map((s) => s.trim()).filter(Boolean),
    timeline: (formData.get("timeline") as string) || null,
    budgetRange: (formData.get("budgetRange") as string) || null,
    resultsVerified: formData.get("resultsVerified") === "on",
    reach: num(formData, "reach"),
    engagement: num(formData, "engagement"),
    leadsGenerated: num(formData, "leadsGenerated"),
    conversions: num(formData, "conversions"),
    roas: num(formData, "roas"),
    cpl: num(formData, "cpl"),
    organicTrafficGrowth: num(formData, "organicTrafficGrowth"),
    keywordGrowth: num(formData, "keywordGrowth"),
    status: (formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as "PUBLISHED" | "DRAFT",
    seoTitle: (formData.get("seoTitle") as string) || null,
    metaDescription: (formData.get("metaDescription") as string) || null,
  };

  if (id) {
    await prisma.caseStudy.update({ where: { id }, data });
  } else {
    await prisma.caseStudy.create({ data });
  }
  revalidatePath("/admin/case-studies");
  revalidatePath("/case-studies");
}

export async function deleteCaseStudyAction(id: string) {
  await requireUser();
  await prisma.caseStudy.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/case-studies");
}
