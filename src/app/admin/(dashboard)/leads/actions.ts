"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import type { LeadStatus } from "@prisma/client";

export async function updateLeadStatusAction(id: string, formData: FormData) {
  await requireUser();
  const status = formData.get("status") as LeadStatus;
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
}

export async function deleteLeadAction(id: string) {
  await requireUser();
  await prisma.lead.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/leads");
}
