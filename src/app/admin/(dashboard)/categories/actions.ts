"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData) {
  await requireUser();
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;
  await prisma.category.create({
    data: { name, slug: slugify(name), description: (formData.get("description") as string) || null },
  });
  revalidatePath("/admin/categories");
}

export async function deleteCategoryAction(id: string) {
  await requireUser();
  await prisma.category.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/categories");
}
