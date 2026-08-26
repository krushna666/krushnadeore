"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { leadSchema } from "@/lib/validations/lead";
import { sendEmail, leadNotificationEmail } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export type LeadFormState = { error?: string } | undefined;

export async function submitLeadAction(_prevState: LeadFormState, formData: FormData): Promise<LeadFormState> {
  // Honeypot — bots fill every field, humans never see this one.
  if ((formData.get("companyWebsiteUrl") as string)?.length) {
    redirect("/thank-you");
  }

  const h = await headers();
  const ip = clientIp(h);
  const { ok } = rateLimit(`lead:${ip}`, 5, 10 * 60 * 1000);
  if (!ok) return { error: "Too many submissions. Please try again in a few minutes." };

  const parsed = leadSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please check the form and try again." };
  }

  const { companyWebsiteUrl: _honeypot, ...data } = parsed.data;
  void _honeypot;

  const lead = await prisma.lead.create({
    data: {
      ...data,
      source: (formData.get("source") as string) || "website",
      utmSource: (formData.get("utm_source") as string) || null,
      utmMedium: (formData.get("utm_medium") as string) || null,
      utmCampaign: (formData.get("utm_campaign") as string) || null,
      utmTerm: (formData.get("utm_term") as string) || null,
      utmContent: (formData.get("utm_content") as string) || null,
      landingPage: (formData.get("landingPage") as string) || null,
      referrer: h.get("referer") || null,
    },
  });

  const { subject, html, text } = leadNotificationEmail(lead);
  await sendEmail({ to: process.env.LEAD_NOTIFICATION_EMAIL || "support@olyxmedia.com", subject, html, text });

  redirect("/thank-you");
}
