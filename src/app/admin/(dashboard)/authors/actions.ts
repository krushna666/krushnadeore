"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createAuthorAction(formData: FormData) {
  await requireUser();
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;
  await prisma.author.create({
    data: {
      name,
      slug: slugify(name),
      jobTitle: (formData.get("jobTitle") as string) || null,
      bio: (formData.get("bio") as string) || null,
      photoUrl: (formData.get("photoUrl") as string) || null,
    },
  });
  revalidatePath("/admin/authors");
}

export async function deleteAuthorAction(id: string) {
  await requireUser();
  await prisma.author.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/authors");
}
