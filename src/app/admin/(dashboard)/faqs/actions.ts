"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createFaqAction(formData: FormData) {
  await requireUser();
  const question = (formData.get("question") as string)?.trim();
  const answer = (formData.get("answer") as string)?.trim();
  if (!question || !answer) return;
  await prisma.fAQ.create({
    data: {
      question,
      answer,
      category: (formData.get("category") as string) || null,
      pageSlug: (formData.get("pageSlug") as string) || null,
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/admin/faqs");
}

export async function deleteFaqAction(id: string) {
  await requireUser();
  await prisma.fAQ.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/faqs");
}
