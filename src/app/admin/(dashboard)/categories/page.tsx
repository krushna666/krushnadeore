import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCategoryAction, deleteCategoryAction } from "./actions";

export const metadata = { title: "Categories | OlyxMedia Admin" };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Blog Categories</h1>
      <form action={createCategoryAction} className="flex flex-wrap gap-3 rounded-2xl border border-border p-4">
        <Input name="name" placeholder="Category name" required className="max-w-xs" />
        <Input name="description" placeholder="Description (optional)" className="max-w-sm" />
        <Button type="submit">Add</Button>
      </form>
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase text-muted">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Posts</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted">{c.slug}</td>
                <td className="p-3 text-muted">{c._count.posts}</td>
                <td className="p-3 text-right">
                  <form action={deleteCategoryAction.bind(null, c.id)}>
                    <Button size="sm" variant="destructive" type="submit">
                      Delete
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
