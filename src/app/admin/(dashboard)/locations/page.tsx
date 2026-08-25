import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { saveLocationAction, deleteLocationAction } from "./actions";
import type { Location } from "@prisma/client";

export const metadata = { title: "Locations | OlyxMedia Admin" };

function LocationFields({ loc }: { loc?: Location }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {loc && <input type="hidden" name="id" value={loc.id} />}
      <Input name="name" placeholder="Page name (e.g. Social Media Marketing Agency in Wakad)" defaultValue={loc?.name} required className="sm:col-span-2" />
      <Input name="slug" placeholder="Slug (auto if blank)" defaultValue={loc?.slug} />
      <Input name="city" placeholder="City" defaultValue={loc?.city} required />
      <Input name="region" placeholder="Region" defaultValue={loc?.region || "Maharashtra"} />
      <Textarea name="intro" placeholder="Intro paragraph — genuinely local, not thin content" defaultValue={loc?.intro || ""} rows={3} className="sm:col-span-2" />
      <Textarea name="localProblems" placeholder="Local market problems this page addresses" defaultValue={loc?.localProblems || ""} rows={2} className="sm:col-span-2" />
      <Textarea name="servicesOffered" placeholder={"Services offered here (one per line)"} defaultValue={loc?.servicesOffered.join("\n") || ""} rows={3} />
      <Textarea name="industriesServed" placeholder={"Industries served (one per line)"} defaultValue={loc?.industriesServed.join("\n") || ""} rows={3} />
      <Textarea name="processContent" placeholder="Process content" defaultValue={loc?.processContent || ""} rows={2} className="sm:col-span-2" />
      <Select name="status" defaultValue={loc?.status || "DRAFT"}>
        <option value="DRAFT">Draft (not published — avoid thin pages)</option>
        <option value="PUBLISHED">Published</option>
      </Select>
      <Input name="seoTitle" placeholder="SEO title" defaultValue={loc?.seoTitle || ""} />
      <Textarea name="metaDescription" placeholder="Meta description" defaultValue={loc?.metaDescription || ""} rows={2} className="sm:col-span-2" />
      <Button type="submit" className="sm:col-span-2">
        {loc ? "Save changes" : "Add location page"}
      </Button>
    </div>
  );
}

export default async function LocationsAdminPage() {
  const locations = await prisma.location.findMany({ orderBy: { city: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Local SEO Locations</h1>
        <p className="text-sm text-muted">
          Only publish once the page has genuinely useful, unique local content — avoid thin duplicate pages.
        </p>
      </div>
      <details className="rounded-2xl border border-border p-4">
        <summary className="cursor-pointer font-semibold">+ New location page</summary>
        <form action={saveLocationAction} className="mt-4">
          <LocationFields />
        </form>
      </details>
      <div className="space-y-3">
        {locations.map((loc) => (
          <details key={loc.id} className="rounded-2xl border border-border p-4">
            <summary className="flex cursor-pointer items-center justify-between">
              <span className="font-medium">{loc.name}</span>
              <Badge variant={loc.status === "PUBLISHED" ? "success" : "outline"}>{loc.status}</Badge>
            </summary>
            <form action={saveLocationAction} className="mt-4">
              <LocationFields loc={loc} />
            </form>
            <form action={deleteLocationAction.bind(null, loc.id)} className="mt-2">
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
