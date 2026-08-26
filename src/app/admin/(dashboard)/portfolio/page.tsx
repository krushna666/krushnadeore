import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { savePortfolioAction, deletePortfolioAction } from "./actions";
import type { Portfolio } from "@prisma/client";

export const metadata = { title: "Portfolio | OlyxMedia Admin" };

const CATEGORIES = ["SOCIAL_MEDIA", "BRANDING", "REELS", "GRAPHIC_DESIGN", "WEBSITES", "SEO", "PAID_ADS", "CAMPAIGNS"];

function PortfolioFields({ item }: { item?: Portfolio }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {item && <input type="hidden" name="id" value={item.id} />}
      <Input name="title" placeholder="Title" defaultValue={item?.title} required />
      <Input name="slug" placeholder="Slug (auto if blank)" defaultValue={item?.slug} />
      <Select name="category" defaultValue={item?.category || "SOCIAL_MEDIA"}>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c.replace("_", " ")}
          </option>
        ))}
      </Select>
      <Input name="clientName" placeholder="Client (optional)" defaultValue={item?.clientName || ""} />
      <Input name="externalUrl" placeholder="External URL (optional)" defaultValue={item?.externalUrl || ""} />
      <Input name="coverImageUrl" placeholder="Cover image URL" />
      <Select name="status" defaultValue={item?.status || "DRAFT"}>
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </Select>
      <Textarea name="description" placeholder="Description" defaultValue={item?.description || ""} className="sm:col-span-2" rows={2} />
      <Button type="submit" className="sm:col-span-2">
        {item ? "Save changes" : "Add portfolio item"}
      </Button>
    </div>
  );
}

export default async function PortfolioAdminPage() {
  const items = await prisma.portfolio.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Portfolio</h1>

      <details className="rounded-2xl border border-border p-4">
        <summary className="cursor-pointer font-semibold">+ New portfolio item</summary>
        <form action={savePortfolioAction} className="mt-4">
          <PortfolioFields />
        </form>
      </details>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <details key={item.id} className="rounded-2xl border border-border p-4">
            <summary className="flex cursor-pointer items-center justify-between">
              <span className="font-medium">{item.title}</span>
              <Badge variant={item.status === "PUBLISHED" ? "success" : "outline"}>{item.status}</Badge>
            </summary>
            <form action={savePortfolioAction} className="mt-4">
              <PortfolioFields item={item} />
            </form>
            <form action={deletePortfolioAction.bind(null, item.id)} className="mt-2">
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
