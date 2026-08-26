"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createRedirectAction(formData: FormData) {
  await requireAdmin();
  const fromPath = (formData.get("fromPath") as string)?.trim();
  const toPath = (formData.get("toPath") as string)?.trim();
  if (!fromPath || !toPath) return;

  await prisma.redirect.create({
    data: {
      fromPath: fromPath.startsWith("/") ? fromPath : `/${fromPath}`,
      toPath,
      statusCode: Number(formData.get("statusCode")) || 301,
    },
  });
  revalidatePath("/admin/redirects");
}

export async function toggleRedirectAction(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.redirect.update({ where: { id }, data: { active: formData.get("active") === "on" } });
  revalidatePath("/admin/redirects");
}

export async function deleteRedirectAction(id: string) {
  await requireAdmin();
  await prisma.redirect.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/redirects");
}
