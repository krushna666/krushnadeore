import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deletePostAction } from "./actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Blog Posts | OlyxMedia Admin" };

const statusVariant: Record<string, "default" | "success" | "warning" | "outline"> = {
  PUBLISHED: "success",
  DRAFT: "outline",
  REVIEW: "warning",
  SCHEDULED: "warning",
  ARCHIVED: "outline",
};

export default async function BlogsListPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: true, category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog Posts</h1>
        <Link href="/admin/blogs/new">
          <Button>New Post</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase text-muted">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Category</th>
              <th className="p-3">Author</th>
              <th className="p-3">Updated</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-border">
                <td className="p-3 font-medium">{post.title}</td>
                <td className="p-3">
                  <Badge variant={statusVariant[post.status] || "default"}>{post.status}</Badge>
                </td>
                <td className="p-3 text-muted">{post.category?.name || "—"}</td>
                <td className="p-3 text-muted">{post.author?.name || "—"}</td>
                <td className="p-3 text-muted">{formatDate(post.updatedAt)}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/blogs/${post.id}/edit`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                    <form action={deletePostAction.bind(null, post.id)}>
                      <Button size="sm" variant="destructive" type="submit">
                        Delete
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="p-6 text-center text-sm text-muted">No blog posts yet.</p>}
      </div>
    </div>
  );
}
