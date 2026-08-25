import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTagAction, deleteTagAction } from "./actions";

export const metadata = { title: "Tags | OlyxMedia Admin" };

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Blog Tags</h1>
      <form action={createTagAction} className="flex flex-wrap gap-3 rounded-2xl border border-border p-4">
        <Input name="name" placeholder="Tag name" required className="max-w-xs" />
        <Button type="submit">Add</Button>
      </form>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <div key={t.id} className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm">
            {t.name} <span className="text-muted">({t._count.posts})</span>
            <form action={deleteTagAction.bind(null, t.id)}>
              <button type="submit" className="text-muted hover:text-danger" aria-label={`Delete ${t.name}`}>
                ×
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
