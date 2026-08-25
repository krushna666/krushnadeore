"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { postSchema } from "@/lib/validations/post";
import { readingTimeMinutes, slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

export type SaveState = { error?: string } | undefined;

export async function savePostAction(_prevState: SaveState, formData: FormData): Promise<SaveState> {
  const user = await requireUser();

  const tagIds = formData.getAll("tagIds").map(String).filter(Boolean);
  const parsed = postSchema.safeParse({
    id: (formData.get("id") as string) || undefined,
    title: formData.get("title"),
    slug: slugify((formData.get("slug") as string) || (formData.get("title") as string) || ""),
    excerpt: (formData.get("excerpt") as string) || undefined,
    content: formData.get("content"),
    status: formData.get("status"),
    authorId: (formData.get("authorId") as string) || undefined,
    categoryId: (formData.get("categoryId") as string) || undefined,
    tagIds,
    featuredImageId: (formData.get("featuredImageId") as string) || undefined,
    scheduledAt: (formData.get("scheduledAt") as string) || undefined,
    seoTitle: (formData.get("seoTitle") as string) || undefined,
    metaDescription: (formData.get("metaDescription") as string) || undefined,
    focusKeyword: (formData.get("focusKeyword") as string) || undefined,
    canonicalUrl: (formData.get("canonicalUrl") as string) || undefined,
    ogImageUrl: (formData.get("ogImageUrl") as string) || undefined,
    robotsNoindex: formData.get("robotsNoindex") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input." };
  }

  const data = parsed.data;
  const readingTimeMins = readingTimeMinutes(data.content);
  const scheduledAt = data.status === "SCHEDULED" && data.scheduledAt ? new Date(data.scheduledAt) : null;

  const existing = data.id ? await prisma.post.findUnique({ where: { id: data.id } }) : null;
  const publishedAt =
    data.status === "PUBLISHED" ? existing?.publishedAt ?? new Date() : existing?.publishedAt ?? null;

  // `disconnect` is only valid on update (there's nothing to disconnect from on
  // create), so build the relation ops differently for each case.
  const isUpdate = Boolean(data.id);
  const relationOp = (relatedId: string | undefined) =>
    relatedId ? { connect: { id: relatedId } } : isUpdate ? { disconnect: true as const } : undefined;

  const tagConnections = (data.tagIds || []).map((id) => ({ id }));

  const baseFields = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || null,
    content: data.content,
    status: data.status,
    readingTimeMins,
    scheduledAt,
    publishedAt,
    seoTitle: data.seoTitle || null,
    metaDescription: data.metaDescription || null,
    focusKeyword: data.focusKeyword || null,
    canonicalUrl: data.canonicalUrl || null,
    ogImageUrl: data.ogImageUrl || null,
    robotsNoindex: !!data.robotsNoindex,
  };

  try {
    if (data.id) {
      await prisma.post.update({
        where: { id: data.id },
        data: {
          ...baseFields,
          tags: { set: tagConnections },
          author: relationOp(data.authorId),
          category: relationOp(data.categoryId),
          featuredImage: relationOp(data.featuredImageId),
        },
      });
    } else {
      await prisma.post.create({
        data: {
          ...baseFields,
          tags: { connect: tagConnections },
          ...(data.authorId ? { author: { connect: { id: data.authorId } } } : {}),
          ...(data.categoryId ? { category: { connect: { id: data.categoryId } } } : {}),
          ...(data.featuredImageId ? { featuredImage: { connect: { id: data.featuredImageId } } } : {}),
          createdBy: { connect: { id: user.id } },
        },
      });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "That slug is already in use by another post." };
    }
    throw error;
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  redirect("/admin/blogs");
}

export async function deletePostAction(id: string) {
  await requireUser();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
}
