"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createTagAction(formData: FormData) {
  await requireUser();
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;
  await prisma.tag.create({ data: { name, slug: slugify(name) } });
  revalidatePath("/admin/tags");
}

export async function deleteTagAction(id: string) {
  await requireUser();
  await prisma.tag.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/tags");
}
