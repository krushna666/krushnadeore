"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export type NewsletterState = { message?: string; error?: string } | undefined;

const schema = z.object({ email: z.string().email(), name: z.string().optional() });

export async function subscribeNewsletterAction(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const h = await headers();
  const { ok } = rateLimit(`newsletter:${clientIp(h)}`, 5, 10 * 60 * 1000);
  if (!ok) return { error: "Too many attempts. Try again later." };

  const parsed = schema.safeParse({ email: formData.get("email"), name: formData.get("name") });
  if (!parsed.success) return { error: "Enter a valid email address." };

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: { status: "ACTIVE" },
    create: { email: parsed.data.email, name: parsed.data.name || null },
  });

  return { message: "Subscribed! Thanks for joining." };
}
