import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { saveIndustryAction, deleteIndustryAction } from "./actions";
import type { Industry } from "@prisma/client";

export const metadata = { title: "Industries | OlyxMedia Admin" };

function IndustryFields({ ind }: { ind?: Industry }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {ind && <input type="hidden" name="id" value={ind.id} />}
      <Input name="name" placeholder="Industry name" defaultValue={ind?.name} required />
      <Input name="slug" placeholder="Slug (auto if blank)" defaultValue={ind?.slug} />
      <Textarea name="challenges" placeholder="Industry challenges" defaultValue={ind?.challenges || ""} rows={2} className="sm:col-span-2" />
      <Textarea name="solution" placeholder="OlyxMedia's solution" defaultValue={ind?.solution || ""} rows={2} className="sm:col-span-2" />
      <Textarea name="recommendedServices" placeholder={"Recommended services (one per line)"} defaultValue={ind?.recommendedServices.join("\n") || ""} rows={3} className="sm:col-span-2" />
      <Textarea name="contentStrategy" placeholder="Content strategy" defaultValue={ind?.contentStrategy || ""} rows={2} />
      <Textarea name="leadGenStrategy" placeholder="Lead generation strategy" defaultValue={ind?.leadGenStrategy || ""} rows={2} />
      <Textarea name="seoStrategy" placeholder="SEO strategy" defaultValue={ind?.seoStrategy || ""} rows={2} className="sm:col-span-2" />
      <Select name="status" defaultValue={ind?.status || "DRAFT"}>
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </Select>
      <Input name="seoTitle" placeholder="SEO title" defaultValue={ind?.seoTitle || ""} />
      <Textarea name="metaDescription" placeholder="Meta description" defaultValue={ind?.metaDescription || ""} rows={2} className="sm:col-span-2" />
      <Button type="submit" className="sm:col-span-2">
        {ind ? "Save changes" : "Add industry"}
      </Button>
    </div>
  );
}

export default async function IndustriesAdminPage() {
  const industries = await prisma.industry.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Industries</h1>
      <details className="rounded-2xl border border-border p-4">
        <summary className="cursor-pointer font-semibold">+ New industry</summary>
        <form action={saveIndustryAction} className="mt-4">
          <IndustryFields />
        </form>
      </details>
      <div className="space-y-3">
        {industries.map((ind) => (
          <details key={ind.id} className="rounded-2xl border border-border p-4">
            <summary className="flex cursor-pointer items-center justify-between">
              <span className="font-medium">{ind.name}</span>
              <Badge variant={ind.status === "PUBLISHED" ? "success" : "outline"}>{ind.status}</Badge>
            </summary>
            <form action={saveIndustryAction} className="mt-4">
              <IndustryFields ind={ind} />
            </form>
            <form action={deleteIndustryAction.bind(null, ind.id)} className="mt-2">
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
