"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { sendEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";

export type CreateUserState = { error?: string; tempPassword?: string } | undefined;

export async function createUserAction(_prev: CreateUserState, formData: FormData): Promise<CreateUserState> {
  await requireAdmin();
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const role = (formData.get("role") as Role) || "EDITOR";
  if (!name || !email) return { error: "Name and email are required." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "A user with that email already exists." };

  const tempPassword = crypto.randomBytes(9).toString("base64url");
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  await prisma.user.create({
    data: { name, email, role, passwordHash, mustChangePassword: true },
  });

  await sendEmail({
    to: email,
    subject: "Your OlyxMedia admin account",
    html: `<p>You've been added as ${role} on the OlyxMedia admin. Temporary password: <strong>${tempPassword}</strong></p><p>You will be asked to set a new password on first login.</p>`,
    text: `Temporary password: ${tempPassword} (you'll be asked to change it on first login)`,
  });

  revalidatePath("/admin/users");
  return { tempPassword };
}

export async function updateUserRoleAction(id: string, formData: FormData) {
  const admin = await requireAdmin();
  if (id === admin.id) return; // can't demote yourself accidentally
  await prisma.user.update({ where: { id }, data: { role: formData.get("role") as Role } });
  revalidatePath("/admin/users");
}

export async function deleteUserAction(id: string) {
  const admin = await requireAdmin();
  if (id === admin.id) return;
  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  const target = await prisma.user.findUnique({ where: { id } });
  if (target?.role === "ADMIN" && adminCount <= 1) return; // never delete the last admin
  await prisma.user.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/users");
}
