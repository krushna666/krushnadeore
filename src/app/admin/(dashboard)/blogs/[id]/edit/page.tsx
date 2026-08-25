import { prisma } from "@/lib/db";
import { PostForm } from "@/components/admin/post-form";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Post | OlyxMedia Admin" };

export default async function EditPostPage({ params }: PageProps<"/admin/blogs/[id]/edit">) {
  const { id } = await params;

  const [post, authors, categories, tags, media] = await Promise.all([
    prisma.post.findUnique({ where: { id }, include: { tags: true } }),
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
  ]);

  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit Post</h1>
      <PostForm
        post={{ ...post, tagIds: post.tags.map((t) => t.id) }}
        authors={authors}
        categories={categories}
        tags={tags}
        media={media}
      />
    </div>
  );
}
