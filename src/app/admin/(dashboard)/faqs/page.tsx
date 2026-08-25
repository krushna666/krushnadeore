import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createFaqAction, deleteFaqAction } from "./actions";

export const metadata = { title: "FAQs | OlyxMedia Admin" };

export default async function FaqsPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">FAQs</h1>
      <form action={createFaqAction} className="grid gap-3 rounded-2xl border border-border p-4">
        <Input name="question" placeholder="Question" required />
        <Textarea name="answer" placeholder="Answer" required rows={3} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input name="category" placeholder="Category (optional)" />
          <Input name="pageSlug" placeholder="Attach to page slug (optional)" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked /> Published
        </label>
        <Button type="submit">Add FAQ</Button>
      </form>
      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.id} className="rounded-2xl border border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{f.question}</p>
                <p className="mt-1 text-sm text-muted">{f.answer}</p>
                <div className="mt-2 flex gap-2">
                  {f.category && <Badge variant="outline">{f.category}</Badge>}
                  {f.pageSlug && <Badge variant="outline">/{f.pageSlug}</Badge>}
                  <Badge variant={f.published ? "success" : "outline"}>{f.published ? "Published" : "Hidden"}</Badge>
                </div>
              </div>
              <form action={deleteFaqAction.bind(null, f.id)}>
                <Button size="sm" variant="destructive" type="submit">
                  Delete
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
