"use server";

import { parse } from "csv-parse/sync";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categories = ["VERIFIED_CLIENT", "PORTFOLIO_CLIENT", "PARTNER", "BRAND_WE_ADMIRE"] as const;

export async function createClientAction(formData: FormData) {
  await requireUser();
  const companyName = (formData.get("companyName") as string)?.trim();
  if (!companyName) return;

  const logoUrl = (formData.get("logoUrl") as string) || null;
  let logoId: string | undefined;
  if (logoUrl) {
    const media = await prisma.media.create({
      data: { url: logoUrl, filename: companyName, mimeType: "image/*", size: 0, alt: `${companyName} logo` },
    });
    logoId = media.id;
  }

  await prisma.client.create({
    data: {
      companyName,
      logoId,
      website: (formData.get("website") as string) || null,
      industry: (formData.get("industry") as string) || null,
      category: (formData.get("category") as (typeof categories)[number]) || "BRAND_WE_ADMIRE",
      description: (formData.get("description") as string) || null,
      verified: formData.get("verified") === "on",
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/admin/clients");
  revalidatePath("/");
}

export async function deleteClientAction(id: string) {
  await requireUser();
  await prisma.client.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/clients");
}

const csvRowSchema = z.object({
  company_name: z.string().min(1),
  logo_url: z.string().optional().default(""),
  website: z.string().optional().default(""),
  industry: z.string().optional().default(""),
  category: z.enum(categories).optional().default("BRAND_WE_ADMIRE"),
  verified: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export type CsvPreviewState =
  | { rows: Record<string, string>[]; raw: string; error?: undefined }
  | { error: string; rows?: undefined; raw?: undefined }
  | undefined;

export async function previewClientCsvAction(_prev: CsvPreviewState, formData: FormData): Promise<CsvPreviewState> {
  await requireUser();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a CSV file." };

  const text = await file.text();
  try {
    const records: Record<string, string>[] = parse(text, { columns: true, skip_empty_lines: true, trim: true });
    for (const r of records) csvRowSchema.parse(r);
    return { rows: records.slice(0, 50), raw: text };
  } catch {
    return { error: "Could not parse this CSV. Expected columns: company_name, logo_url, website, industry, category, verified, description." };
  }
}

export async function confirmClientCsvImportAction(formData: FormData) {
  await requireUser();
  const raw = formData.get("raw") as string;
  if (!raw) return;

  const records: Record<string, string>[] = parse(raw, { columns: true, skip_empty_lines: true, trim: true });

  for (const record of records) {
    const row = csvRowSchema.parse(record);
    let logoId: string | undefined;
    if (row.logo_url) {
      const media = await prisma.media.create({
        data: { url: row.logo_url, filename: row.company_name, mimeType: "image/*", size: 0, alt: `${row.company_name} logo` },
      });
      logoId = media.id;
    }
    await prisma.client.create({
      data: {
        companyName: row.company_name,
        logoId,
        website: row.website || null,
        industry: row.industry || null,
        category: row.category,
        description: row.description || null,
        verified: ["true", "1", "yes"].includes(row.verified.toLowerCase()),
        published: true,
      },
    });
  }

  revalidatePath("/admin/clients");
  revalidatePath("/");
}
