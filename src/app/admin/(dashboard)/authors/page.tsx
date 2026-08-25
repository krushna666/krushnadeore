import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createAuthorAction, deleteAuthorAction } from "./actions";

export const metadata = { title: "Authors | OlyxMedia Admin" };

export default async function AuthorsPage() {
  const authors = await prisma.author.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Blog Authors</h1>
      <form action={createAuthorAction} className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-2">
        <Input name="name" placeholder="Full name" required />
        <Input name="jobTitle" placeholder="Job title" />
        <Input name="photoUrl" placeholder="Photo URL (from Media Library)" className="sm:col-span-2" />
        <Textarea name="bio" placeholder="Short bio" rows={2} className="sm:col-span-2" />
        <Button type="submit" className="sm:col-span-2">
          Add author
        </Button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border p-4">
            <p className="font-semibold">{a.name}</p>
            <p className="text-sm text-muted">{a.jobTitle}</p>
            <p className="mt-2 text-xs text-muted">{a._count.posts} posts</p>
            <form action={deleteAuthorAction.bind(null, a.id)} className="mt-3">
              <Button size="sm" variant="destructive" type="submit">
                Delete
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
