"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { saveUploadedFile, UploadValidationError } from "@/lib/storage";
import { revalidatePath } from "next/cache";

export type UploadState = { error?: string } | undefined;

export async function uploadMediaAction(_prevState: UploadState, formData: FormData): Promise<UploadState> {
  const user = await requireUser();
  const file = formData.get("file");
  const alt = (formData.get("alt") as string) || "";

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }
  if (!alt.trim()) {
    return { error: "Alt text is required for every image (SEO requirement)." };
  }

  try {
    const saved = await saveUploadedFile(file);
    await prisma.media.create({
      data: {
        ...saved,
        alt,
        title: (formData.get("title") as string) || null,
        caption: (formData.get("caption") as string) || null,
        uploadedById: user.id,
      },
    });
  } catch (error) {
    if (error instanceof UploadValidationError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/media");
  return undefined;
}

export async function updateMediaAction(id: string, formData: FormData) {
  await requireUser();
  await prisma.media.update({
    where: { id },
    data: {
      alt: (formData.get("alt") as string) || "",
      title: (formData.get("title") as string) || null,
      caption: (formData.get("caption") as string) || null,
    },
  });
  revalidatePath("/admin/media");
}

export async function deleteMediaAction(id: string) {
  await requireUser();
  await prisma.media.delete({ where: { id } }).catch(() => {
    // Referenced elsewhere (featured image, gallery, etc.) — ignore delete.
  });
  revalidatePath("/admin/media");
}
