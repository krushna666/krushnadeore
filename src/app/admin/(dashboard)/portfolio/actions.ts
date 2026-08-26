"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import type { PortfolioCategory } from "@prisma/client";

export async function savePortfolioAction(formData: FormData) {
  await requireUser();
  const id = (formData.get("id") as string) || undefined;
  const title = (formData.get("title") as string)?.trim();
  if (!title) return;

  let coverImageId: string | undefined;
  const coverImageUrl = (formData.get("coverImageUrl") as string) || "";
  if (coverImageUrl) {
    const media = await prisma.media.create({
      data: { url: coverImageUrl, filename: title, mimeType: "image/*", size: 0, alt: title },
    });
    coverImageId = media.id;
  }

  const data = {
    title,
    slug: slugify((formData.get("slug") as string) || title),
    category: formData.get("category") as PortfolioCategory,
    description: (formData.get("description") as string) || null,
    clientName: (formData.get("clientName") as string) || null,
    externalUrl: (formData.get("externalUrl") as string) || null,
    status: (formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as "PUBLISHED" | "DRAFT",
    coverImageId,
  };

  if (id) {
    await prisma.portfolio.update({ where: { id }, data });
  } else {
    await prisma.portfolio.create({ data });
  }
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}

export async function deletePortfolioAction(id: string) {
  await requireUser();
  await prisma.portfolio.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/portfolio");
}
