import { prisma } from "@/lib/db";
import { PostForm } from "@/components/admin/post-form";

export const metadata = { title: "New Post | OlyxMedia Admin" };

export default async function NewPostPage() {
  const [authors, categories, tags, media] = await Promise.all([
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">New Post</h1>
      <PostForm authors={authors} categories={categories} tags={tags} media={media} />
    </div>
  );
}
