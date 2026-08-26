"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function unsubscribeAction(id: string) {
  await requireUser();
  await prisma.newsletterSubscriber.update({ where: { id }, data: { status: "UNSUBSCRIBED" } });
  revalidatePath("/admin/newsletter");
}

export async function deleteSubscriberAction(id: string) {
  await requireUser();
  await prisma.newsletterSubscriber.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/newsletter");
}
