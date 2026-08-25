"use server";

import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { sendEmail } from "@/lib/email";
import { absoluteUrl } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export type ForgotPasswordState = { message?: string; error?: string } | undefined;

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: "Enter a valid email address." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const { ok } = rateLimit(`forgot-password:${ip}`, 5, 60 * 60 * 1000);
  if (!ok) return { error: "Too many attempts. Try again later." };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  // Always return the same message whether or not the account exists,
  // so this endpoint can't be used to enumerate admin/editor accounts.
  const genericMessage = "If an account with that email exists, a reset link has been sent.";

  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashedToken, resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) },
    });

    const resetUrl = absoluteUrl(`/admin/reset-password?token=${rawToken}`);
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your OlyxMedia admin password",
        html: `<p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
        text: `Reset your password: ${resetUrl} (expires in 1 hour)`,
      });
    } catch (error) {
      console.error("Password reset email failed:", error);
      return { error: "We could not send the reset email. Check the SMTP settings and try again." };
    }
  }

  return { message: genericMessage };
}
