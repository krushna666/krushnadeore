import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createGlossaryTermAction, deleteGlossaryTermAction } from "./actions";

export const metadata = { title: "Glossary | OlyxMedia Admin" };

export default async function GlossaryAdminPage() {
  const terms = await prisma.glossaryTerm.findMany({ orderBy: { term: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Marketing Glossary</h1>
      <form action={createGlossaryTermAction} className="grid gap-3 rounded-2xl border border-border p-4">
        <Input name="term" placeholder="Term (e.g. CTR)" required />
        <Textarea name="definition" placeholder="Definition" required rows={2} />
        <Textarea name="example" placeholder="Example (optional)" rows={2} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked /> Published
        </label>
        <Button type="submit">Add term</Button>
      </form>
      <div className="grid gap-3 sm:grid-cols-2">
        {terms.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{t.term}</p>
              <Badge variant={t.status === "PUBLISHED" ? "success" : "outline"}>{t.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">{t.definition}</p>
            <form action={deleteGlossaryTermAction.bind(null, t.id)} className="mt-3">
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
