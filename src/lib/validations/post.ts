import { z } from "zod";

export const postStatusValues = ["DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"] as const;

export const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  status: z.enum(postStatusValues),
  authorId: z.string().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  featuredImageId: z.string().optional(),
  scheduledAt: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  focusKeyword: z.string().optional(),
  canonicalUrl: z.string().optional(),
  ogImageUrl: z.string().optional(),
  robotsNoindex: z.coerce.boolean().optional(),
});

export type PostInput = z.infer<typeof postSchema>;
