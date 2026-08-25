import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { saveServiceAction, deleteServiceAction } from "./actions";
import type { Service } from "@prisma/client";

export const metadata = { title: "Services | OlyxMedia Admin" };

function ServiceFields({ s }: { s?: Service }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {s && <input type="hidden" name="id" value={s.id} />}
      <Input name="name" placeholder="Service name" defaultValue={s?.name} required />
      <Input name="slug" placeholder="Slug (auto if blank)" defaultValue={s?.slug} />
      <Input name="shortDescription" placeholder="Short description" defaultValue={s?.shortDescription || ""} className="sm:col-span-2" />
      <Input name="headline" placeholder="Headline" defaultValue={s?.headline || ""} className="sm:col-span-2" />
      <Textarea name="problem" placeholder="The problem this service solves" defaultValue={s?.problem || ""} rows={2} className="sm:col-span-2" />
      <Textarea name="solution" placeholder="OlyxMedia's solution" defaultValue={s?.solution || ""} rows={2} className="sm:col-span-2" />
      <Textarea name="deliverables" placeholder={"Deliverables (one per line)"} defaultValue={s?.deliverables.join("\n") || ""} rows={4} />
      <Textarea name="process" placeholder={"Process steps (one per line)"} defaultValue={s?.process.join("\n") || ""} rows={4} />
      <Textarea name="benefits" placeholder={"Benefits (one per line)"} defaultValue={s?.benefits.join("\n") || ""} rows={4} className="sm:col-span-2" />
      <Input name="idealClient" placeholder="Ideal client" defaultValue={s?.idealClient || ""} className="sm:col-span-2" />
      <Select name="status" defaultValue={s?.status || "DRAFT"}>
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </Select>
      <Input name="seoTitle" placeholder="SEO title" defaultValue={s?.seoTitle || ""} />
      <Textarea name="metaDescription" placeholder="Meta description" defaultValue={s?.metaDescription || ""} rows={2} className="sm:col-span-2" />
      <Button type="submit" className="sm:col-span-2">
        {s ? "Save changes" : "Add service"}
      </Button>
    </div>
  );
}

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Services</h1>
      <details className="rounded-2xl border border-border p-4">
        <summary className="cursor-pointer font-semibold">+ New service</summary>
        <form action={saveServiceAction} className="mt-4">
          <ServiceFields />
        </form>
      </details>
      <div className="space-y-3">
        {services.map((s) => (
          <details key={s.id} className="rounded-2xl border border-border p-4">
            <summary className="flex cursor-pointer items-center justify-between">
              <span className="font-medium">{s.name}</span>
              <Badge variant={s.status === "PUBLISHED" ? "success" : "outline"}>{s.status}</Badge>
            </summary>
            <form action={saveServiceAction} className="mt-4">
              <ServiceFields s={s} />
            </form>
            <form action={deleteServiceAction.bind(null, s.id)} className="mt-2">
              <Button size="sm" variant="destructive" type="submit">
                Delete
              </Button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}
