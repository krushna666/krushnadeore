"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createGlossaryTermAction(formData: FormData) {
  await requireUser();
  const term = (formData.get("term") as string)?.trim();
  const definition = (formData.get("definition") as string)?.trim();
  if (!term || !definition) return;
  await prisma.glossaryTerm.create({
    data: {
      term,
      slug: slugify(term),
      definition,
      example: (formData.get("example") as string) || null,
      status: formData.get("published") === "on" ? "PUBLISHED" : "DRAFT",
    },
  });
  revalidatePath("/admin/glossary");
  revalidatePath("/glossary");
}

export async function deleteGlossaryTermAction(id: string) {
  await requireUser();
  await prisma.glossaryTerm.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/glossary");
  revalidatePath("/glossary");
}
